const {Command} = require('../command');
const {allUsers} = require('../player');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

exports.logout = class extends Command {
    /**
     * Logout command.
     */
    constructor() {
        super('logout', 0);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
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
};
