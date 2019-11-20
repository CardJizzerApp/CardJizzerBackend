const {Command} = require('../command');
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
        const {maxplayers, deckids, password, pointstowin,
            maxroundtime, gametitle} = args;
        return this.isUserLoggedIn(ws, (player, err) => {
            if (err !== undefined) {
                return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
            }
            const game = new Game({
                deckids,
                gametitle,
                maxplayers,
                maxroundtime,
                ownerUUID: ws.uuid,
                password,
                pointstowin,
            });

            new GameChangedEvent().trigger(ChangeAction.GAME_CREATED);
            player.join(game.id);
            return ech.sendResponse(Responses.OK, game.toJSON());
        });
    }
}

exports.createGame = CreateGame;
