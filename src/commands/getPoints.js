const {ErrorCodeHelper, Responses} = require('../helper');

const {Command} = require('../command');

const {getGameByUUID} = require('../game');
const {getPlayerByUUID} = require('../player');

const ech = new ErrorCodeHelper();

exports.getPoints = class extends Command {
    /**
     * Get points of players in the current game.
     */
    constructor() {
        super('getpoints', [], false);
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
        return ech.sendResponse(Responses.OK,
            getGameByUUID(player.currentGameUUID).scoreboard);
    }
};

exports.addPoint = function(uuid) {
    if (scoreboard[uuid] === undefined) {
        return scoreboard[uuid] = 1;
    }
    return scoreboard[uuid] = scoreboard[uuid] + 1;
};
