const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.CardReceivedEvent = class extends Event {
    /**
     * @param {Game} game
     * @param {any} card
     */
    trigger(game, card) {
        for (let i = 0; i !== game.players.length; i++) {
            const player = game.players[i];
            const websocket = player.websocket;
            websocket.send(ech.sendResponse(Responses.CARD_RECEIVED, card));
        }
    }
};
