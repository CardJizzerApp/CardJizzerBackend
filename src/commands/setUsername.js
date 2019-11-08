/**
 * @deprecated
 * !- Deprecated
 * This command is deprecated.
 */
const {Command} = require('../command');
const {getPlayerByUUID, Player} = require('../player');
const {allUsers} = require('../userUtils');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

exports.setUsername = class extends Command {
    /**
     * Setusername [username: string]
     */
    constructor() {
        super('setusername', ['username']);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        const usernameGiven = args.username;
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
        return ech.sendResponse(Responses.OK, {newUsername: args[0]});
    }
};
