const { v4 } = require("uuid");
const CardCastAPI = require("cardcast-api");
const { Card } = require("./card");
const { Round } = require("./round");
const { GAME_CONFIG } = require("./config");


const api = new CardCastAPI.CardcastAPI();

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
        // this.fetchDecks(deckIds);
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
        return true;
    }

    giveCard(player) {
        this.playerCardStacks[player].push(this.randomCard("response"));
    }

    initGame() {
        for (let i = 0; i !== this.players.length; i++) {
            const player = players[i];
            for (let j = 0; j !== GAME_CONFIG.CARDS_AT_START; j++) {
                this.giveCard(player);
            }
        }
    }

    nextRound() {
        const newCardJizzer = this.round === undefined || this.round.cardJizzer === undefined ? this.players[0] : this.players[this.players.indexOf(this.round.cardJizzer) == this.players.cardJizzer.length-1 ? 0 : this.players.indexOf(this.round.cardJizzer)];
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
exports.getGameByUUID = getGameByUUID;
