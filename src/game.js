const {v4} = require("uuid");
const CardCastAPI = require("cardcast-api");

const api = new CardCastAPI.CardcastAPI();

const allGames = [];
const allUsers = [];


exports.allGames = allGames;
exports.allUsers = allUsers;

const GameState = {
    INGAME: {joinable: false},
    STOPPED: {joinable: false},
    LOBBY: {joinable: true},
}
exports.GameState = GameState;

const CARDS_AT_START = 6;

const Game = class {

    constructor(maxplayers, deckIds, password, pointsToWin, maxRoundTime) {
        this.currentRound = 0;
        this.id = v4();
        this.players = [];
        this.maxplayers = maxplayers;
        this.deckIds = deckIds;
        this.password = password;
        this.pointsToWin = pointsToWin;
        this.maxRoundTime = maxRoundTime;
        this.state = GameState.LOBBY;
        this.cards = {
            calls: [],
            responses: [],
        };
        this.fetchDecks(deckIds);
        this.playerCardStacks = {};
        allGames.push(this);
    }

    start() {
        this.state = GameState.INGAME;
        this.nextRound();
    }

    stop() {
        this.state = GameState.LOBBY;
    }

    fetchDecks(deckIds) {
        for (let i = 0; i!== deckIds.length; i++) {
            const deckId = deckIds[i];

            api.deck(deckId).then(deck => {
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

    addToGame(player) {
        this.players.push(player);
        player.currentGameUUID = this.id;
    }

    giveCard(player) {
        this.playerCardStacks[player].push(this.randomCard("response"));
    }

    initGame() {
        for (let i = 0; i !== this.players.length; i++) {
            const player = players[i];
            for (let j = 0; j !== CARDS_AT_START; j++) {
                this.giveCard(player);
            }
        }
    }

    nextRound() {
        const newCardJizzer = this.round.cardJizzer === undefined ? this.players[0] : this.players[this.players.indexOf(this.round.cardJizzer) == this.players.cardJizzer.length-1 ? 0 : this.players.indexOf(this.round.cardJizzer)];
        this.round = new Round(newCardJizzer, this.randomCard("call"));
        if (this.currentRound === 1) {
            this.initGame();
        }
        for (let i = 0; i !== this.players.length; i++) {
            const player = this.players[i];
            this.giveCard(player);
        }
    }

    randomCard(type) {
        if (type === "call") {
            return this.cards.calls[Math.floor(Math.random() * Math.floor(this.cards.calls.length))];
        } else {
            return this.cards.responses[Math.floor(Math.random() * Math.floor(this.cards.responses.length))];
        }
    }

}
exports.Game = Game;

/**
 * 
 * @param {*} uuid
 * @returns Game 
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
exports.getGameByUUID = this.getGameByUUID;

exports.Player = class {

    constructor(websocket, username) {
        this.uuid = websocket.uuid;
        this.websocket = websocket;
        this.username = username;
        this.currentGameUUID = -1;
        allUsers.push(this);
    }

    playCard(carduuid) {
        if (this.currentGameUUID === -1) {
            return false;
        }
        const game = getGameByUUID(this.currentGameUUID);
        if (game === undefined || game.state !== GameState.INGAME) {
            return false;
        }
        const hand = game.playerCardStacks[player];
        for (let i = 0; i !== hand.length; i++) {
            const card = hand[i];
            if (card.uuid === carduuid) {
                console.log("Played");
            }
            return false;
        }
    }

    join(gameUUID) {
        if (player.currentGameUUID !== -1) {
            return false;
        }
        getGameByUUID(gameUUID).addToGame(this);
    }

}

exports.getPlayerByUUID = function(uuid) {
    for (let i = 0; i !== allUsers.length; i++) {
        const player = allUsers[i];
        const p_uuid = player.uuid;
        if (uuid === p_uuid) {
            return player;
        }
    }
    return undefined;
}

const Card = class {

    constructor(text, type) {
        this.text = text;
        this.type = type || "response";
        this.show = false;
    }

}
exports.Card = this.Card;

const Round = class {
    
    constructor(cardJizzer, blackCard) {
        this.allCards = {};
        this.cardJizzer = cardJizzer;
        this.blackCard = blackCard;
    }

    flipAllCards() {
        for (let i = 0; i!== this.allCards; i++) {
            const card = this.allCards;
            card.show = true;
        }
    }

}
exports.Round = Round;