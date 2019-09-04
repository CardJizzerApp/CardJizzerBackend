const {Command} = require('../command');
const {getGameByUUID, GameState} = require('../game');
const {getPlayerByUUID} = require('../player');
const {phaseState} = require('../round');

const {PlayerPlayedCardEvent} = require('../events/playerPlayedCardEvent');
const {EveryBodyPickedEvent} = require('../events/everyBodyPickedEvent');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();


exports.playCard = class extends Command {
    /**
     * playcard [cardUUID: string]
     */
    constructor() {
        super('playcard', ['cardid']);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        const cardUUID = args.cardid;
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        const game = getGameByUUID(player.currentGameUUID);
        if (game === undefined || game.state !== GameState.INGAME) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        const round = game.round;
        if (round.phase === phaseState.SelectCard) {
            return ech.sendResponse(Responses.PICK_PHASE_OVER, null);
        }
        if (player.playCard(cardUUID)) {
            new PlayerPlayedCardEvent().trigger(game, player);
            if (game.round.hasEverybodyPicked()) {
                new EveryBodyPickedEvent().trigger(game);
            }
            return ech.sendResponse(Responses.OK, null);
        }
        return ech.sendResponse(Responses.CARD_COULD_NOT_BE_PLAYED, null);
    }
};
