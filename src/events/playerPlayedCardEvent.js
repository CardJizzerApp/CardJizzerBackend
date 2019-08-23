const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.PlayerPlayedCardEvent = class extends Event {
    /**
     * @param {Game} game
     * @param {Player} player
     */
    trigger(game, player) {
        for (let i = 0; i !== game.players.length; i++) {
            const playerI = game.players[i];
            const websocket = playerI.websocket;
            websocket.send(
                ech.sendResponse(Responses.CARD_PLAYED,
                    {uuid: player.uuid}));
        }
    }
};
