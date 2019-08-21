
const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.GameOverEvent = class extends Event {
    /**
     * @param {Game} game
     * @param {string} winnerUUID
     */
    trigger(game, winnerUUID) {
        for (let i = 0; i !== game.players.length; i++) {
            const player = game.players[i];
            const websocket = player.websocket;
            websocket.send(ech.sendResponse(Responses.GAME_OVER, winnerUUID));
        }
    }
};
