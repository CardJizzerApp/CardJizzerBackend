const {Command} = require('../command');
const {allGames} = require('../game');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();


exports.fetchGames = class extends Command {
    /**
     * Fetch all available games.
     */
    constructor() {
        super('fetchgames', []);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args) {
        const allGamesToServe = [];
        for (let i = 0; i !== allGames.length; i++) {
            const game = allGames[i];
            allGamesToServe.push(game.toJSON());
        }
        return ech.sendResponse(Responses.OK, allGamesToServe);
    }
};
