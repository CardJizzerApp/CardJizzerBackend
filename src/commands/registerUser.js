const passwordHash = require('password-hash');

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
            'idToken',
        ], true);
    }
    /**
     * @param {string[]} args
     * @return {string}
     */
    async run(args) {
        const response = await this.registerUser(args) ?
            Responses.OK :
            Responses.INVALID_TOKEN;
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
        const hash = passwordHash.generate(password);
        await User.create({idToken, password: hash, username}, (err) => {
            if (err !== null) {
                return false;
            }
            return true;
        });
    }
};
