const {Command} = require('../command');
const {getGameByUUID, GameState} = require('../game');
const {getPlayerByUUID} = require('../player');

const {PlayerJoinedEvent} = require('../events/playerJoinedEvent');
const {GameChangedEvent, ChangeAction} = require('../events/gameChangedEvent');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

exports.join = class extends Command {
    /**
     * join [gameUUID: UUID / string]
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
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        const game = getGameByUUID(gameUUID);
        if (game === undefined || game.state === GameState.STOPPED) {
            return ech.sendResponse(Responses.GAME_NOT_FOUND, null);
        }
        if (game.state === GameState.INGAME) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        if (player.join(game.id)) {
            new PlayerJoinedEvent().trigger(game, player);
            new GameChangedEvent().trigger(
                ChangeAction.PLAYER_JOINED,
                game.toJSON()
            );
            return ech.sendResponse(Responses.OK, game.toJSON());
        }
        return ech.sendResponse(Responses.COULD_NOT_JOIN, null);
    }
};
