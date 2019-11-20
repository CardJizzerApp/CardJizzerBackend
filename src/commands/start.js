const {Command} = require('../command');
const {GameState} = require('../game');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

exports.start = class extends Command {
    /**
     * Start command for starting a game.
     */
    constructor() {
        super('start', [], true);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     */
    async run(args, ws) {
        return this.isInGame(ws, (game) => {
            if (game.state !== GameState.LOBBY) {
                return ech.sendResponse(Responses.GAME_ALREADY_INGAME, null);
            }
            if (ws.uuid !== game.ownerUUID) {
                return ech.sendResponse(Responses.NOT_LOBBY_OWNER, null);
            }
            return game.start().then(() => {
                return ech.sendResponse(Responses.OK, game);
            });
        });
    }
};
