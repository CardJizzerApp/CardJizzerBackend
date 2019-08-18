const { Command } = require("../command");
const { getGameByUUID, GameState } = require("../game");
const { getPlayerByUUID } = require("../player");

const { ErrorCodeHelper, Responses } = require("../helper");
const ech = new ErrorCodeHelper();

exports.join = class extends Command {

    // join [gameUUID: string]
    constructor() {
        super("join", 1);
    }

    run(args, ws) {
        const gameUUID = args[0];
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        const game = getGameByUUID(gameUUID);
        if (game === undefined || game.state === GameState.STOPPED) {
            return ech.sendResponse(Responses.GAME_NOT_FOUND, null);
        }
        if (game.state === GameState.INGAME) {
            return ech.sendResponse(Responses.NOT_INGAME, null)
        }
        if (player.join(game.id)) {
            return ech.sendResponse(Responses.OK, null);
        }
        return ech.sendResponse(Responses.COULD_NOT_JOIN, null);

    }

}