const {Command} = require('../command');
const {getPlayerByUUID} = require('../player');
const {getGameByUUID} = require('../game');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.fetchNames = class extends Command {
    /**
     * Fetch names of all players in current game.
     */
    constructor() {
        super('fetchnames', 0);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        if (!this.isUserLoggedIn(ws, true)) return;
        const player = getPlayerByUUID(ws.uuid);

        if (!this.isGameInProgress(player.currentGameUUID, true)) return;
        const game = getGameByUUID(ws.uuid);

        const usernames = {};
        game.players.forEach((queryPlayer) => {
            usernames[queryPlayer.uuid] = usernames[queryPlayer.username];
        });
        return ech.sendResponse(Responses.OK, usernames);
    }
};
