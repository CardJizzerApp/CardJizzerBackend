const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.EveryBodyPickedEvent = class extends Event {
    /**
     * @param {Game} game
     */
    trigger(game) {
        for (let i = 0; i !== game.players.length; i++) {
            const player = game.players[i];
            const websocket = player.websocket;
            websocket.send(
                ech.sendResponse(
                    Responses.CARDS_FLIPPED,
                    game.round.allCards,
                ),
            );
        }
    }
};
