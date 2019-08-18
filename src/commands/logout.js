const { Command } = require("../command");

exports.logout = class extends Command {

    constructor() {
        super("logout", 0);
    }

    run(args, ws) {
        for (let i = 0; i !== allUsers.length; i++) {
            const player = allUsers[i];
            if (player.uuid === ws.uuid) {
                allUsers.splice(i, 1);
                return ech.sendResponse(Responses.OK, null);
            }
        }
        return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
    }

}