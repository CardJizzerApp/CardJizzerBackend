const { Command } = require("../command");

exports.pickCard = class extends Command {

    // pickcard [cardUUID: string]
    constructor() {
        super("pickcard", 1);
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
        if (game.round.cardJizzer.uuid !== player.uuid) {
            return ech.sendResponse(Responses.NOT_CARD_JIZZER, null);
        }
        const pickable = getGameByUUID(player).round.allCards;
        console.log(pickable);
        player.playCard(args[1]);
    }
}
