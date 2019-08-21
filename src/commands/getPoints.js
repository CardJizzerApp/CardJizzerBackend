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
        super('getpoints', 0, false);
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
        const game = getGameByUUID(player.currentGameUUID);
        if (game === undefined) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        return ech.sendResponse(Responses.OK, game.scoreboard);
    }
};

exports.addPoint = function(uuid) {
    if (scoreboard[uuid] === undefined) {
        return scoreboard[uuid] = 1;
    }
    return scoreboard[uuid] = scoreboard[uuid] + 1;
};
