const allCommands = [];

const {Dependencies} = require('./dependencyHandler');

const {getPlayerByUUID} = require('./player');
const {getGameByUUID, GameState} = require('./game');

const {ErrorCodeHelper, Responses} = require('./helper');

const ech = new ErrorCodeHelper();

exports.Command = class {
    /**
     * @param {string} commandname
     * @param {object} requiredArgs
     * @param {boolean} async
     */
    constructor(commandname, requiredArgs, async) {
        this.commandname = commandname;
        this.requiredArgs = requiredArgs;
        this.async = async;
        allCommands.push(this);
    }
    /**
     * @param {App} app
     */
    setApp(app) {
        this.app = app;
    }
    /**
     * @param {string[]} args
     * @param {websocket} ws
     */
    run(args, ws) { }
    /**
     * Sets an object to a given key in redis.
     * @param {string} key
     * @param {any} value
     * @return {Promise}
     */
    setRedis(key, value) {
        return new Promise((resolve) => {
            Dependencies['redis'].set(key, value, () => {
                resolve(true);
            });
        });
    }
    /**
     * Fetches the value from a given key from redis.
     * @param {string} key
     * @return {Promise}
     */
    getRedis(key) {
        return new Promise((resolve) => {
            Dependencies['redis'].get(key, (err, response) => {
                resolve(response);
            });
        });
    }
    /**
     * Check if user is logged in
     * @param {Websocket} ws
     * @param {function (player, err)} cb
     * @return {boolean}
     */
    isUserLoggedIn(ws, cb) {
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            cb(undefined, new Error('User not logged in'));
            return false;
        }
        cb(player, undefined);
        return true;
    }
    /**
     * @param {string} gameId
     * @param {function (game, err)} cb
     * @return {boolean}
     */
    isGameInProgress(gameId, cb) {
        const game = getGameByUUID(gameId);
        if (game === undefined || game.state === GameState.STOPPED) {
            cb(undefined, new Error('User not ingame.'));
            return false;
        }
        cb(game, undefined);
        return true;
    }
    /**
     * @param {Websocket} ws
     * @param {function (game, player, err)} cb
     * @return {boolean}
     */
    isInGame(ws, cb) {
        const player = getPlayerByUUID(ws.uuid);
        this.isUserLoggedIn(ws, (game, (player) => {

        }));
        const game = getGameByUUID(getPlayerByUUID(ws.uuid).currentGameUUID);
        if (game === undefined || game.state === GameState.STOPPED) {
            return false;
        }
        cb(game, player);
        return this.isGameInProgress(game.id, true);
    }
};

const {createGame} = require('./commands/createGame');
const {fetchAllPlayedCards} = require('./commands/fetchAllPlayedCards');
const {fetchCards} = require('./commands/fetchCards');
const {fetchGames} = require('./commands/fetchGames');
const {join} = require('./commands/join');
const {logout} = require('./commands/logout');
const {pickCard} = require('./commands/pickCard');
const {playCard} = require('./commands/playCard');
const {setUsername} = require('./commands/setUsername');
const {start} = require('./commands/start');
const {fetchNames} = require('./commands/fetchNames');
const {registerUser} = require('./commands/registerUser');
const {login} = require('./commands/login');

exports.registerCommands = function registerCommands(app) {
    /* eslint-disable */
    new login().setApp(app);
    new registerUser().setApp(app);
    new createGame().setApp(app);
    new fetchGames().setApp(app);
    new setUsername().setApp(app);
    new logout().setApp(app);
    new join().setApp(app);
    new playCard().setApp(app);
    new start().setApp(app);
    new fetchCards().setApp(app);
    new pickCard().setApp(app);
    new fetchAllPlayedCards().setApp(app);
    new fetchNames().setApp(app);
    /* eslint-enable */
};

exports.RegisterUser = registerUser;
exports.CreateGame = createGame;
exports.FetchGames = fetchGames;
exports.SetUsername = setUsername;
exports.Logout = logout;
exports.PlayCard = playCard;
exports.Start = start;
exports.FetchCards = fetchCards;
exports.FetchAllPlayedCards = fetchAllPlayedCards;
exports.FetchNames = fetchNames;
exports.Login = login;

exports.findCommand = function(commandname) {
    for (let i = 0; i !== allCommands.length; i++) {
        const command = allCommands[i];
        if (command.commandname === commandname) {
            return command;
        }
    }
};
