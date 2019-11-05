const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.PlayerJoinedEvent = class extends Event {
    /**
     * @param {Game} game
     * @param {Player} player
     */
    trigger(game, player) {
        for (let i = 0; i !== game.players.length; i++) {
            const playerI = game.players[i];
            if (playerI.uuid === player.uuid) {
                continue;
            }
            const websocket = playerI.websocket;
            websocket.send(
                ech.sendResponse(
                    Responses.PLAYER_JOINED,
                    {username: player.username, uuid: player.uuid},
                ),
            );
        }
    }
};
