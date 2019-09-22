const {Command} = require('../command');
const {getGameByUUID, GameState} = require('../game');
const {getPlayerByUUID} = require('../player');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

exports.start = class extends Command {
    /**
     * Start command for starting a game.
     */
    constructor() {
        super('start', [], true);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     */
    async run(args, ws) {
        if (!this.isInGame(ws, true)) return;
        const player = getPlayerByUUID(ws.uuid);
        const game = getGameByUUID(player.currentGameUUID);
        if (game.state !== GameState.LOBBY) {
            return ech.sendResponse(Responses.GAME_ALREADY_INGAME, null);
        }
        return game.start().then(() => {
            return ech.sendResponse(Responses.OK, game);
        });
    }
};
