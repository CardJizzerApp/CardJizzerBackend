const {Command} = require('../command');
const {getGameByUUID, GameState} = require('../game');

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
        return this.isInGame(ws, (_, player, err) => {
            if (player === undefined) {
                return ech.sendResponse(Responses.NOT_LOGGED_IN);
            }
            if (err === undefined) {
                return ech.sendResponse(Responses.COULD_NOT_JOIN);
            }
            const game = getGameByUUID(gameUUID);
            const success = player.join(gameUUID);
            if (game.state === GameState.INGAME) {
                return ech.sendResponse(Responses.ALREADY_INGAME, null);
            }
            return success ?
                ech.sendResponse(Responses.OK, game.toJSON()) :
                ech.sendResponse(Responses.COULD_NOT_JOIN, null);
        });
    }
    /**
     * @param{Game} game
     * @param{Player} player
     */
    triggerEvents(game, player) {
        new PlayerJoinedEvent().trigger(game, player);
        new GameChangedEvent().trigger(
            ChangeAction.PLAYER_JOINED,
            game.toJSON()
        );
    }
};
