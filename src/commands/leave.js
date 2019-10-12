const {ErrorCodeHelper, Responses} = require('../helper');

const {Command} = require('../command');

const {getGameByUUID} = require('../game');
const {getPlayerByUUID} = require('../player');

const ech = new ErrorCodeHelper();

exports.leave = class extends Command {
    /**
     * Get points of players in the current game.
     */
    constructor() {
        super('leave', [], false);
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
        const game = getGameByUUID(player.currentGameUUID);
        const success = game.removeFromGame(player);
        return success ?
            ech.sendResponse(Responses.OK, null) :
            ech.sendResponse(Responses.NOT_INGAME);
    }
};
