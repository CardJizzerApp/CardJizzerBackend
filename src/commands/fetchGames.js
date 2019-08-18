const { Command } = require("../command");
const { allGames } = require("../game");

const { ErrorCodeHelper, Responses } = require("../helper");
const ech = new ErrorCodeHelper();


exports.fetchGames = class extends Command {

    // fetchgames
    constructor() {
        super("fetchgames", 0);
    }

    run(args) {
        const allGamesToServe = [];
        for (let i = 0; i !== allGames.length; i++) {
            const game = JSON.parse(JSON.stringify(allGames[i]));
            game.password = undefined;
            game.players = undefined;
            allGamesToServe.push(game);
        }
        return ech.sendResponse(Responses.OK, allGamesToServe);
    }

}