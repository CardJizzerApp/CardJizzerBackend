const { Command } = require("../command");
const { getGameByUUID } = require("../game");
const { allUsers, getPlayerByUUID, Player } = require("../player");

const { ErrorCodeHelper, Responses } = require("../helper");
const ech = new ErrorCodeHelper();

exports.setUsername = class extends Command {

    // setusername [username: string]
    constructor() {
        super("setusername", 1);
    }

    run(args, ws) {
        const usernameGiven = args[0];
        for (let i = 0; i !== allUsers.length; i++) {
            const player = allUsers[i];
            if (player.username.toLowerCase() === usernameGiven.toLowerCase()) {
                return ech.sendResponse(Responses.NAME_ALREADY_TAKEN, null);
            }
        }
        if (getPlayerByUUID(ws.uuid) === undefined) {
            new Player(ws, usernameGiven);
        } else {
            getPlayerByUUID(ws.uuid).username = usernameGiven;

        }
        return ech.sendResponse(Responses.OK, { newUsername: args[0] });
    }

}