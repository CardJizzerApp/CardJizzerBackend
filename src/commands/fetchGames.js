const {Command} = require('../command');

const {Dependencies} = require('../dependencyHandler');

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
     * @return {string}
     */
    run() {
        const allGamesClone = Dependencies['allGames'].map((c) => c.toJSON());
        return ech.sendResponse(Responses.OK, allGamesClone);
    }
};
