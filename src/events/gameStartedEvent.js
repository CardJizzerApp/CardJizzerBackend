const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.GameStartedEvent = class extends Event {
    /**
     * @param {Game} game
     */
    trigger(game) {
        this.sendToGameMembers(game,
            ech.sendResponse(Responses.GAME_STARTED, null));
    }
};
