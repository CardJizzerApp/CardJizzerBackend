const {Command} = require('../command');
const {phaseState} = require('../round');
const {getGameByUUID} = require('../game');
const {getPlayerByUUID} = require('../player');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

exports.fetchAllPlayedCards = class extends Command {
    /**
     * Fetch all laid down cards.
     */
    constructor() {
        super('fetchallcards', []);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        if (!this.isUserLoggedIn(ws, true)) return;
        if (!this.isInGame(ws, true)) return;
        const player = getPlayerByUUID(ws.uuid);
        const game = getGameByUUID(player.currentGameUUID);
        const round = game.round;
        if (round.phase === phaseState.PlayCards) {
            return ech.sendResponse(Responses.OK, Object.keys(round.allCards));
        }
        return ech.sendResponse(Responses.OK, round.allCards);
    }
};
