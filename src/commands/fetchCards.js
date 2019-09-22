const {Command} = require('../command');
const {getGameByUUID} = require('../game');
const {getPlayerByUUID} = require('../player');

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
        if (!this.isUserLoggedIn(ws, true)) return;
        if (!this.isInGame(ws, true)) return;
        const player = getPlayerByUUID(ws.uuid);
        const game = getGameByUUID(player.currentGameUUID);
        const hand = game.getCardsOfPlayer(player);
        return ech.sendResponse(Responses.OK, hand);
    }
};
