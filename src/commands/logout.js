const {Command} = require('../command');
const {Dependencies} = require('../dependencyHandler');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

exports.logout = class extends Command {
    /**
     * Logout command.
     */
    constructor() {
        super('logout', []);
    }
    /**
     * @param {string[]} _
     * @param {Websocket} ws
     * @return {string}
     */
    run(_, ws) {
        const player = Dependencies.allPlayers.find((c) => c.uuid === ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        Dependencies.allPlayers.reduce((c) => c.uuid === ws.uuid);
        return ech.sendResponse(Responses.OK, null);
    }
};
