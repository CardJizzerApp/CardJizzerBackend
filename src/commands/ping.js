const {Command} = require('../command');
const {getPlayerByUUID, allUsers} = require('../player');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.Ping = class extends Command {
    /**
     * Command for letting the server know wheter a client is activ
     * or not.
     */
    constructor() {
        super('ping', 0, false);
    }

    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        const index = allUsers.indexOf(player);
        if (index === -1) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        player.lastPing = new Date().getTime();
        return ech.sendResponse(Responses.PING, null);
    }
};
