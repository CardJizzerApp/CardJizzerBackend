const { Command } = require("../command");
const { getPlayerByUUID } = require("../player");
const { Game } = require("../game");


const { ErrorCodeHelper, Responses } = require("../helper");
const ech = new ErrorCodeHelper();


class CreateGame extends Command {


    // creategame [maxplayers: int] [cardcast-deck-ids: array[number]] [password: string] [pointsToWin: number] [maxRoundTime: number]
    // if no password: [password: string] = false
    constructor(commandname, argsLength, async) {
        super("creategame", 4, false);
    }

    run(args, ws) {
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        const maxPlayers = args[0];
        const deckIds = args[1];
        const password = args[2];
        const passwordRequired = password !== "false";
        const pointsToWin = args[3];
        const maxRoundTime = args[4];
        const game = new Game(maxPlayers, ['SFG96'], password, pointsToWin, maxRoundTime);
        player.join(game.id);
        return ech.sendResponse(Responses.OK, game);
    }
}

exports.createGame = CreateGame;