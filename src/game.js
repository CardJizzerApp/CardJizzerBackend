const { v4 } = require("uuid");
const CardCastAPI = require("cardcast-api");
const { Card } = require("./card");
const { Round } = require("./round");
const { GAME_CONFIG } = require("./config");


const api = new CardCastAPI.CardcastAPI();

const cardCache = {};

const allGames = [];

exports.allGames = allGames;

const GameState = {
    INGAME: {joinable: false},
    STOPPED: {joinable: false},
    LOBBY: {joinable: true},
}
exports.GameState = GameState;

const Game = class {

    constructor(maxplayers, deckIds, password, pointsToWin, maxRoundTime) {
        this.currentRound = 0;
        this.id = v4();
        this.maxplayers = maxplayers;
        this.deckIds = deckIds;
        this.password = password;
        this.pointsToWin = pointsToWin;
        this.maxRoundTime = maxRoundTime;
        this.state = GameState.LOBBY;
        this.players = [];
        this.cards = {
            calls: [],
            responses: [],
        };
        this.playerCardStacks = {};
        allGames.push(this);
    }

    async start() {
        this.state = GameState.INGAME;
        return this.fetchDecks(this.deckIds).then(() => {
            this.nextRound();
        });
    }

    stop() {
        this.state = GameState.LOBBY;
    }

    async fetchDecks(deckIds) {
        for (let i = 0; i !== deckIds.length; i++) {
            const deckId = deckIds[i];
            const deckFromCache = getDeckFromCache(deckId);
            if (deckFromCache !== undefined) {
                for (let i = 0; i !== deckFromCache.responses.length; i++) {
                    this.cards.responses.push(deckFromCache.responses[i]);
                }
                for (let i = 0; i !== deckFromCache.calls.length; i++) {
                    this.cards.calls.push(deckFromCache.calls[i]);
                }
            } else {
                return api.deck(deckId).then(deck => {
                    deck.populatedPromise.then(() => {
                        this.cards.calls.push(deck.calls);
                        for (let i = 0; i !== deck.calls.length; i++) {
                            const call = deck.calls[i];
                            let text = "";
                            for (let j = 0; j !== call.text.length; j++) {
                                text += call.text[j] + "{w}";
                            }
                            this.cards.calls.push(new Card(text, "call"));
                        }
    
                        for (let i = 0; i !== deck.responses.length; i++) {
                            const response = deck.responses[i];
                            this.cards.responses.push(new Card(response.text));
                        }
                    });
                });
            }
        }
    }

    /**
     * 
     * @param {*} player 
     * @return {boolean}
     */
    addToGame(player) {
        this.players.push(player);
        player.currentGameUUID = this.id;
        return true;
    }

    giveCard(player) {
        if (this.playerCardStacks[player.uuid] === undefined)
            this.playerCardStacks[player.uuid] = [];
        const originalCard = this.randomCard("response");
        delete this.cards.responses[originalCard];
        const card = JSON.parse(JSON.stringify(originalCard));
        card.uuid = v4();
        this.playerCardStacks[player.uuid].push(card);
    }

    initGame() {
        for (let i = 0; i !== this.players.length; i++) {
            const player = this.players[i];
            for (let j = 0; j !== GAME_CONFIG.CARDS_AT_START; j++) {
                this.giveCard(player);
            }
        }
    }

    nextRound() {
        const newCardJizzer = this.round === undefined || this.round.cardJizzer === undefined ? this.players[0] : this.players[this.players.indexOf(this.round.cardJizzer) == this.players.cardJizzer.length-1 ? 0 : this.players.indexOf(this.round.cardJizzer)];
        this.round = new Round(newCardJizzer, this.randomCard("call"), this.players.length);
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
        if (type === "call") {
            return this.cards.calls[Math.floor(Math.random() * Math.floor(this.cards.calls.length))];
        } else {
            return this.cards.responses[Math.floor(Math.random() * Math.floor(this.cards.responses.length))];
        }
    }
    
    /**
     * @return {Card[]}
     */
    getCardsOfPlayer(player) {
        return this.playerCardStacks[player.uuid];
    }

}
exports.Game = Game;

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
}
exports.getDeckFromCache = getDeckFromCache;

/**
 * 
 * @param {*} uuid
 * @return {Game}
 */
function getGameByUUID(uuid) {
    for (let i = 0; i !== allGames.length; i++) {
        const game = allGames[i];
        if (game.id === uuid) {
            return game;
        }
    }
    return undefined;
}
exports.getGameByUUID = getGameByUUID;
