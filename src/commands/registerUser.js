
const {Command} = require('../command');

const User = require('../models/user');

const {ErrorCodeHelper, Responses} = require('../helper');
const {isTokenValid} = require('../oAuthUtils');

const ech = new ErrorCodeHelper();


exports.registerUser = class extends Command {
    /**
     * Start command for starting a game.
     */
    constructor() {
        super('registeruser', [
            'username',
            'password',
            'email',
            'oauth_token',
        ], false);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        const response = this.registerUser(args) ?
            Responses.OK :
            Responses.INVALID_JSON;
        return ech.sendResponse(response, null);
    }
    /**
     * Register a user
     * @param {
     *  {username: string, password: string, idToken: string}
     * } userObject
     * @return {boolean}
     */
    async registerUser(userObject) {
        const {username, password, idToken} = userObject;
        const validToken = await isTokenValid(idToken);
        if (!validToken) {
            return false;
        }
        await User.create({idToken, password, username}, (err) => {
            if (err !== null) {
                return false;
            }
            return true;
        });
    }
};
