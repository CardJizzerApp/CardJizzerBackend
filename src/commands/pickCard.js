const {Command} = require('../command');

const {ErrorCodeHelper, Responses} = require('../helper');

const {getGameByUUID, GameState} = require('../game');
const {getPlayerByUUID} = require('../player');

const {RoundStoppedEvent} = require('../events/roundStoppedEvent');

const ech = new ErrorCodeHelper();

exports.pickCard = class extends Command {
    /**
     * pickcard [cardUUID: string]
     */
    constructor() {
        super('pickcard', 1, false);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        const player = getPlayerByUUID(ws.uuid);
        const carduuid = args[0];
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        if (player.currentGameUUID === -1) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        const game = getGameByUUID(player.currentGameUUID);
        if (game === undefined || game.state !== GameState.INGAME) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        if (game.round.cardJizzer.uuid !== player.uuid) {
            return ech.sendResponse(Responses.NOT_CARD_JIZZER, null);
        }
        const keys = Object.keys(game.round.allCards);
        for (let i = 0; i !== keys.length; i++) {
            const playerUUID = keys[i];
            for (let j = 0; j !== game.round.allCards[playerUUID].length; j++) {
                const card = game.round.allCards[playerUUID][j];
                if (card.uuid === carduuid) {
                    for (let x = 0; x !== game.players.length; x++) {
                        if (game.players[x].uuid === playerUUID) {
                            new RoundStoppedEvent().trigger(game,
                                game.players[x]);
                            game.nextRound(playerUUID);
                            return ech.sendResponse(Responses.OK, null);
                        }
                    }
                }
            }
        }
        return ech.sendResponse(Responses.CARD_COULD_NOT_BE_PICKED, null);
    }
};
