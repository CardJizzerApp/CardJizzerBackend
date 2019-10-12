const {Command} = require('../command');
const {phaseState} = require('../round');

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
        return this.isInGame(ws, (game, player, gerr) => {
            if (gerr !== undefined) {
                return;
            };
            const round = game.round;
            if (round.phase === phaseState.PlayCards) {
                return ech.sendResponse(Responses.OK,
                    Object.keys(round.allCards));
            }
            return ech.sendResponse(Responses.OK, round.allCards);
        });
    }
};
