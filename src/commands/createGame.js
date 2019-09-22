const {Command} = require('../command');
const {getPlayerByUUID} = require('../player');
const {Game} = require('../game');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

const {GameChangedEvent, ChangeAction} = require('../events/gameChangedEvent');

/**
 * Creates a game.
 */
class CreateGame extends Command {
    /**
     * Creating game.
     * creategame maxplayers:number deckIds:number[] password:string
     * pointsToWin:number maxRoundTime:number gameTitle:string
     */
    constructor() {
        super('creategame', [
            'maxplayers',
            'deckids',
            'password',
            'pointstowin',
            'maxroundtime',
            'gametitle',
        ], false);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        if (!this.isUserLoggedIn(ws, true)) return;
        if (this.isInGame(ws, false)) {
            return ech.sendResponse(Responses.ALREADY_INGAME, null);
        }
        const player = getPlayerByUUID(ws.uuid);
        const {maxplayers, deckids, password, pointstowin,
            maxroundtime, gametitle} = args;
        const game = new Game(
            maxplayers,
            deckids,
            password,
            pointstowin,
            maxroundtime,
            gametitle
        );
        player.join(game.id);
        new GameChangedEvent().trigger(
            ChangeAction.GAME_CREATED,
            game.toJSON()
        );
        return ech.sendResponse(Responses.OK, game.toJSON());
    }
}

exports.createGame = CreateGame;
