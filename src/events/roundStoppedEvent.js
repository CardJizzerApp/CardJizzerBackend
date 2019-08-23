const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.RoundStoppedEvent = class extends Event {
    /**
     * @param {Game} game
     * @param {Player} winner
     */
    trigger(game, winner) {
        for (let i = 0; i !== game.players.length; i++) {
            const player = game.players[i];
            player.websocket.send(
                ech.sendResponse(Responses.CARD_JIZZER_PICKED,
                    {winner: winner.uuid})
            );
        }
    }
};
