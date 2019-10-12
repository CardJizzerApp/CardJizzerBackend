
const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.GameOverEvent = class extends Event {
    /**
     * @param {Game} game
     * @param {string} winnerUUID
     */
    trigger(game, winnerUUID) {
        this.sendToGameMembers(game,
            ech.sendResponse(Responses.GAME_OVER, winnerUUID));
    }
};
