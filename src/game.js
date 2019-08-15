const {v4} = require("uuid");
const CardCastAPI = require("cardcast-api");

const api = new CardCastAPI.CardcastAPI();

const allGames = [];
const allUsers = {};


exports.allGames = allGames;
exports.allUsers = allUsers;

const GameState = {
    INGAME: {joinable: false},
    STOPPED: {joinable: false},
    LOBBY: {joinable: true},
}

exports.Game = class {

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
        this.playerWhiteCards = {};
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
                    this.cards.responses.push(deck.responses);
                });
            });
        }
    }

    joinToGame(player) {
        this.players.push(player);
    }

    nextRound() {
        this.currentRound += 1;
        for (let i = 0; i !== this.players.length; i++) {
            // player isn't a object it's a websocket.
            const player = this.players[i];
            player.send()
        }
    }
}

exports.Player = class {

    constructor(websocket, username) {
        this.uid = v4();
        this.websocket = websocket;
        this.username = username;
        this.currentGameUUID = 0;
    }

}

exports.Card = class {
    
    constructor(text) {
        this.text = text;
    }

}