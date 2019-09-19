const {OAuth2Client} = require('google-auth-library');

const {getEnvironment} = require('../environment');

const {Command} = require('../command');

const User = require('../models/user');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

const env = getEnvironment();

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
     * Fetches user profile data.
     * @param {string} idToken
     * @param {boolean} test
     * @return {boolean}
     */
    async getUserProfile(idToken) {
        try {
            const clientId = test ?
                env.GOOGLE_OAUTH_CLIENT_ID :
                env.TESTENV.GOOGLE_OAUTH_CLIENT_ID;
            const client = new OAuth2Client(
                clientId
            );
            const ticket = await client.verifyIdToken({
                audience: clientId,
                idToken,
            });
            const payload = ticket.getPayload();
            return payload;
        } catch (err) {
            throw new Error('Payload error');
        }
    }
    /**
     * Checks whether the token is valid or not.
     * @param {string} idToken
     */
    async isTokenValid(idToken) {
        try {
            await this.getUserProfile(idToken);
            return true;
        } catch (err) {
            return false;
        }
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
        const validToken = await this.isTokenValid(idToken);
        if (!validToken) {
            return false;
        }
        await User.create({idToken, password, username}, (err, response) => {
            return true;
        });
    }
};
