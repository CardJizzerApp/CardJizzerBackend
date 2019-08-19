const {Command} = require("../command");
const {getPlayerByUUID} = require("../player");
const {getGameByUUID} = require("../game");
const { ErrorCodeHelper, Responses } = require("../helper");

const ech = new ErrorCodeHelper();

exports.fetchNames = class extends Command {


    constructor() {
        super("fetchnames", 0);
    }

    run(args, ws) {
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        const game = getGameByUUID(ws.uuid);
        if (game === undefined) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        const usernames = {};
        for (let i = 0; i !== game.players; i++) {
            const playerI = game.players[i];
            usernames[playerI.uuid] = playerI.username;
        }
        return ech.sendResponse(Responses.OK, usernames);
    }

}