const {Command} = require('../command');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();


exports.fetchCards = class extends Command {
    /**
     * Fetch users' cards
     */
    constructor() {
        super('fetchcards', []);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        return this.isInGame(ws, (game, player, err) => {
            if (err !== undefined) {
                return ech.sendResponse(Responses.NOT_INGAME);
            }
            const hand = game.getCardsOfPlayer(player);
            return ech.sendResponse(Responses.OK, hand);
        });
    }
};
