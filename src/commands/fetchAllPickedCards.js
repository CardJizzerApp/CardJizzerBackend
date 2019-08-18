const { Command } = require("../command");
const { phaseState } = require("../round");
const { getGameByUUID, GameState } = require("../game");
const { getPlayerByUUID } = require("../player");

const { ErrorCodeHelper, Responses } = require("../helper");
const ech = new ErrorCodeHelper();

exports.fetchAllPickedCards = class extends Command {

    constructor() {
        super("fetchallcards", 0);
    }

    run(args, ws) {
        const player = getPlayerByUUID(ws.uuid);
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
        const round = game.round;
        if (round.phase === phaseState.PlayCards) {
            return ech.sendResponse(Responses.PLAYERS_NEED_TO_PICK_FIRST, null);
        }
        return ech.sendResponse(Responses.OK, game.round.allCards);
    }

}