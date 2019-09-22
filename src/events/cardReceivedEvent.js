const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.CardReceivedEvent = class extends Event {
    /**
     * @param {Game} game
     * @param {any} card
     */
    trigger(game, card) {
        this.sendToGameMembers(game,
            ech.sendResponse(Responses.CARD_RECEIVED, card));
    }
};
