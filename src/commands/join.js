const {Command} = require('../command');
const {getGameByUUID, GameState} = require('../game');
const {getPlayerByUUID} = require('../player');

const {PlayerJoinedEvent} = require('../events/playerJoinedEvent');
const {GameChangedEvent, ChangeAction} = require('../events/gameChangedEvent');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

exports.join = class extends Command {
    /**
     * Join [gameUUID: UUID / string]
     */
    constructor() {
        super('join', ['gameid']);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        const gameUUID = args.gameid;
        if (!this.isUserLoggedIn(ws, true)) return;
        const player = getPlayerByUUID(ws.uuid);

        if (!this.isGameInProgress(gameUUID, true)) return;
        const game = getGameByUUID(gameUUID);
        if (game.state === GameState.INGAME) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        let success = false;
        if (player.join(game.id)) {
            new PlayerJoinedEvent().trigger(game, player);
            new GameChangedEvent().trigger(
                ChangeAction.PLAYER_JOINED,
                game.toJSON()
            );
            success = true;
        }
        return success ?
            ech.sendResponse(Responses.OK, game.toJSON()) :
            ech.sendResponse(Responses.COULD_NOT_JOIN, null);
    }
};
