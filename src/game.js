const {getEnvironment} = require('./environment');

const {v4} = require('uuid');
const {Round} = require('./round');
const CardCastAPI = require('cardcast-api');
const {Card} = require('./card');
const {GAME_CONFIG} = require('./config');

const {GameOverEvent} = require('./events/gameOverEvent');
const {GameChangedEvent, ChangeAction} = require('./events/gameChangedEvent');

const {Dependencies} = require('./dependencyHandler');

const api = new CardCastAPI.CardcastAPI();

const cardCache = {};

const allGames = [];

module.exports.allGames = allGames;

const GameState = {
    INGAME: {joinable: false},
    LOBBY: {joinable: true},
    STOPPED: {joinable: false},
};
module.exports.GameState = GameState;

const Game = class {
    /**
     * @param {any} gameSettings
     */
    constructor(gameSettings) {
        // Maxplayers, deckIds, password, pointsToWin,
        // MaxRoundTime, title
        this.currentRound = 0;
        this.id = v4();
        this.maxplayers = gameSettings.maxplayers;
        this.deckIds = gameSettings.deckids;
        this.password = gameSettings.password;
        this.pointsToWin = gameSettings.pointstowin;
        this.maxRoundTime = gameSettings.maxroundtime;
        this.title = gameSettings.title;
        this.state = GameState.LOBBY;
        this.players = [];
        if (this.title === undefined) {
            this.title = v4();
        }
        this.cards = {
            calls: [],
            responses: [],
        };
        this.scoreboard = {};
        this.playerCardStacks = {};
        allGames.push(this);
        Dependencies['redis'].set('allgames', JSON.stringify(allGames));
    }
    /**
     * Starts the game.
     */
    async start() {
        this.state = GameState.INGAME;
        if (getEnvironment().TYPE !== 'prod') {
            this.mockDecks();
            this.nextRound();
        } else {
            return this.fetchDecks(this.deckIds).then(() => {
                this.nextRound();
            }).catch((error) => {
                return false;
            });
        }
    }
    /**
     * Mock decks
     */
    mockDecks() {
        this.cards.calls = [
            {text: 'Mein Dad... {w}', uuid: v4()},
            {text: 'Mein Dad... {w}', uuid: v4()},
            {text: 'Mein Dad... {w}', uuid: v4()},
            {text: 'Mein Dad... {w}', uuid: v4()},
            {text: 'Mein Dad... {w}', uuid: v4()},
        ];
        this.cards.responses = [
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
            {text: 'Testkarte', uuid: v4()},
        ];
    }
    /**
     * Stops the game.
     */
    stop() {
        this.state = GameState.LOBBY;
        setTimeout(() => {
            for (let i = 0; i !== this.players.length; i++) {
                const player = this.players[i];
                player.currentGameUUID = -1;
            }
            new GameChangedEvent().trigger(ChangeAction.GAME_REMOVED, null);
            delete allGames[allGames.indexOf(this)];
            delete this;
        }, 10 * 1000);
    }
    /**
     * @param {Deck} deck
     */
    addCardsFromDeck(deck) {
        const cardsForCache = {
            calls: [],
            responses: [],
        };
        deck.calls.forEach((call) => {
            let text = '';
            call.text.forEach((part) => {
                text += part + '{w}';
            });
            this.cards.calls.push(new Card(text, 'call'));
            cardsForCache.calls.push(new Card(text, 'call'));
        });
        deck.responses.forEach((response) => {
            this.cards.responses.push(new Card(response.text, 'response'));
            cardsForCache.responses.push(new Card(response.text, 'response'));
        });
        cardCache[deckId] = cardsForCache;
    }
    /**
     * Fetch decks
     */
    async fetchDecks() {
        const deckIds = this.deckIds;
        for (let i = 0; i !== deckIds.length; i++) {
            const deckId = deckIds[i];
            const deckCached = Object.keys(cardCache).indexOf(deckId) !== -1;
            if (!deckCached) {
                return api.deck(deckId).then((deck) => {
                    deck.populatedPromise.then(() => {
                        this.addCardsFromDeck(deck, deckId);
                    });
                });
            } else {
                getDeckFromCache(deckId);
            }
        }
    }
    /**
     * @param {*} player
     * @return {boolean}
     */
    addToGame(player) {
        this.players.push(player);
        player.currentGameUUID = this.id;
        return true;
    }
    /**
     * @param {Player} player
     * @return {boolean}
     */
    removeFromGame(player) {
        const index = this.players.indexOf(player);
        if (index !== -1) {
            delete this.players[index];
            return true;
        }
        return false;
    }
    /**
     * @param {Player} player
     */
    giveCard(player) {
        if (this.playerCardStacks[player.uuid] === undefined) {
            this.playerCardStacks[player.uuid] = [];
        }
        const originalCard = this.randomCard('response');
        delete this.cards.responses[originalCard];
        const card = JSON.parse(JSON.stringify(originalCard));
        card.uuid = v4();
        this.playerCardStacks[player.uuid].push(card);
    }
    /**
     * Initializes game.
     */
    initGame() {
        for (let i = 0; i !== this.players.length; i++) {
            const player = this.players[i];
            this.scoreboard[player.uuid] = 0;
            for (let j = 0; j !== GAME_CONFIG.CARDS_AT_START; j++) {
                this.giveCard(player);
            }
        }
    }
    /**
     * @param {string} winneruuid
     */
    checkWinner(winneruuid) {
        if (winneruuid !== undefined) {
            this.scoreboard[winneruuid] = this.scoreboard += 1;
            if (this.scoreboard[winneruuid] >= 8) {
                this.state = GameState.STOPPED;
                setTimeout(deleteRoom, 20000);
                new GameOverEvent().trigger(this, winneruuid);
                return;
            }
        }
    }
    /**
     * @return {number}
     */
    getIndexOfNewCardJizzer() {
        let indexOfNewCardJizzer = 0;
        if (this.round === undefined ||
            this.round.cardJizzer === undefined) {
            indexOfNewCardJizzer = 0;
        } else {
            const indexOfCurrentCardJizzer = this.players.indexOf(
                this.round.cardJizzer
            );
            indexOfNewCardJizzer = indexOfCurrentCardJizzer;
            if (indexOfCurrentCardJizzer + 1 >= this.players.length) {
                indexOfNewCardJizzer = 0;
            } else {
                indexOfNewCardJizzer += 1;
            }
        }
        return indexOfNewCardJizzer;
    }
    /**
     * @param {string} winneruuid
     */
    nextRound(winneruuid) {
        if (this.checkWinner(winneruuid)) {
            return;
        }
        const newCardJizzer = this.players[this.getIndexOfNewCardJizzer()];
        this.round = new Round(newCardJizzer,
            this.randomCard('call'), this.players.length);
        this.currentRound += 1;
        if (this.currentRound === 1) {
            this.initGame();
            return;
        }
        for (let i = 0; i !== this.players.length; i++) {
            const player = this.players[i];
            this.giveCard(player);
        }
    }

    /**
     *
     * @param {*} type
     * @return {Card}
     */
    randomCard(type) {
        if (type === 'call') {
            return this.cards.calls[
                Math.floor(Math.random()
                    *
                    Math.floor(this.cards.calls.length))
            ];
        } else {
            return this.cards.responses[
                Math.floor(Math.random()
                    *
                    Math.floor(this.cards.responses.length))
            ];
        }
    }

    /**
     * @param {Player} player
     * @return {Card[]}
     */
    getCardsOfPlayer(player) {
        return this.playerCardStacks[player.uuid];
    }
    /**
     * Deletes the game.
     */
    deleteRoom() {
        for (let i = 0; i !== this.players.length; i++) {
            const player = this.players[i];
            player.currentGameUUID = -1;
        }
        delete allGames[this];
    }
    /**
     * Returns all players with minified information. (UUID and USERNAME)
     * @return {Player[]}
     */
    allPlayersToJSON() {
        const playerList = [];
        for (let i = 0; i !== this.players.length; i++) {
            const player = this.players[i];
            playerList.push(player.toJSON());
        }
        return playerList;
    }
    /**
     * Returns the game with minified information.
     * @return {any}
     */
    toJSON() {
        return {
            deckIds: this.deckIds,
            id: this.id,
            maxplayers: this.maxplayers,
            passwordRequired: this.passwordRequired,
            players: this.allPlayersToJSON(),
            pointsToWin: this.pointsToWin,
            scoreboard: this.scoreboard,
            title: this.title,
        };
    }
};
module.exports.Game = Game;

/**
 *
 * @param {*} deckId
 * @return {Card[]}
 */
function getDeckFromCache(deckId) {
    const cCkeys = Object.keys(cardCache);
    for (let j = 0; j !== cCkeys.length; j++) {
        const cDeck = cardCache[cCkeys[j]];
        if (deckId === cCKeys[j]) {
            return cDeck;
        }
    }
};
module.exports.getDeckFromCache = getDeckFromCache;

/**
 *
 * @param {string} uuid
 * @return {Game}
 */
const getGameByUUID = function(uuid) {
    for (let i = 0; i !== allGames.length; i++) {
        const game = allGames[i];
        if (game.id === uuid) {
            return game;
        }
    }
};
module.exports.getGameByUUID = getGameByUUID;
