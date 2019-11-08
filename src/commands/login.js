const {Player} = require('../player');

const User = require('../models/user');

const {Command} = require('../command');
const {ErrorCodeHelper, Responses} = require('../helper');

const {getUserProfile, isUserAlreadyRegistered} = require('../oAuthUtils');

const ech = new ErrorCodeHelper();

exports.login = class extends Command {
    /**
     * Fetch names of all players in current game.
     */
    constructor() {
        super('login', ['loginData'], true);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    async run(args, ws) {
        return await this.login(ws, args.loginData);
    }
    /**
     * @param {Websocket} ws
     * @param {any} loginData
     * @return {Response}
     */
    async login(ws, loginData) {
        const loginWithIdToken = loginData.idToken !== undefined;
        if (!loginWithIdToken && loginData.username === undefined) {
            return ech.sendResponse(Responses.INVALID_USAGE);
        }
        const username = loginWithIdToken ?
            (await User.find({idToken: loginData.idToken}))[0].username :
            (await User.find({password: loginData.password,
                username: loginData.username}))[0].username;
        if (username === undefined) {
            return ech.sendResponse(Responses.INVALID_TOKEN, null);
        }
        new Player(ws, username);
        return ech.sendResponse(Responses.OK, null);
    }
};
