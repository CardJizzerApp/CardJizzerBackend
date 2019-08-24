const {Command} = require('../command');
const {getPlayerByUUID} = require('../player');
const {Game} = require('../game');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

/**
 * Creates a game.
 */
class CreateGame extends Command {
    /**
     * Creating game.
     */
    constructor() {
        super('creategame', 5, false);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        const maxPlayers = args[0];
        // const deckIds = args[1];
        const password = args[2];
        // const passwordRequired = password !== 'false';
        const pointsToWin = args[3];
        const maxRoundTime = args[4];
        const gameTitle = args[5];
        const game = new Game(
            maxPlayers,
            ['SFG96'],
            password,
            pointsToWin,
            maxRoundTime,
            gameTitle
        );
        player.join(game.id);
        return ech.sendResponse(Responses.OK, {
            maxplayers: Number.parseInt(maxPlayers),
        });
    }
}

exports.createGame = CreateGame;
