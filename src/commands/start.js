const { Command } = require("../command");
const { getGameByUUID, GameState } = require("../game");
const { getPlayerByUUID } = require("../player");

const { ErrorCodeHelper, Responses } = require("../helper");
const ech = new ErrorCodeHelper();

exports.start = class extends Command {

    constructor() {
        super("start", 0, true);
    }

    async run(args, ws) {
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        if (player.currentGameUUID === -1) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        const game = getGameByUUID(player.currentGameUUID);
        if (game === undefined || game.state !== GameState.LOBBY) {
            return ech.sendResponse(Responses.GAME_ALREADY_INGAME, null);
        }
        return game.start().then(() => {
            return ech.sendResponse(Responses.OK, game);
        });
    }

}