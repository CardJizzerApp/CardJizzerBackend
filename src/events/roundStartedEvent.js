const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.RoundStartedEvent = class extends Event {
    /**
     * @param {Game} game
     */
    trigger(game) {
        this.sendToGameMembers(game,
            ech.sendResponse(Responses.NEW_ROUND_STARTED, null));
    }
};
