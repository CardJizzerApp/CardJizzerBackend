const {Game} = require("../game");
const {Event} = require("./event");
const {ErrorCodeHelper, Responses} = require("../helper");

const ech = new ErrorCodeHelper();

exports.RoundStoppedEvent = class extends Event {

    constructor() {}

    /**
     * 
     * @param {Game} game 
     */
    trigger(game, winner) {
        for (let i = 0; i !== game.players.length; i++) {
            const player = game.players[i];
            player.websocket.send(ech.sendResponse(Responses.GAME_OVER, {winner: winner.uuid}));
        }
    }

}