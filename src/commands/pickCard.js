const { Command } = require("../command");

const { ErrorCodeHelper, Responses } = require("../helper");

const { getGameByUUID, GameState } = require("../game");
const { getPlayerByUUID } = require("../player");

const ech = new ErrorCodeHelper();

exports.pickCard = class extends Command {

    // pickcard [cardUUID: string]
    constructor() {
        super("pickcard", 1);
    }

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
            const uuid = keys[i];
            for (let j = 0; j !== keys[j].length; j++) {
                const card = game.round.allCards[keys[i]][j];
                if (card.uuid === carduuid) {
                    game.nextRound(uuid);
                    // TODO: Round over event.
                    return true;
                }
            }
        }
    }
}
