const {Command} = require('../command');
const {ErrorCodeHelper, Responses} = require('../helper');

const {getUserProfile, isUserAlreadyRegistered} = require('../oAuthUtils');

const ech = new ErrorCodeHelper();

exports.login = class extends Command {
    /**
     * Fetch names of all players in current game.
     */
    constructor() {
        super('login', ['idToken']);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        const response = this.login(ws, args['idToken']);
        return ech.sendResponse(response, null);
    }
    /**
     * @param {Websocket} ws
     * @param {string} idToken
     * @return {Response}
     */
    async login(ws, idToken) {
        try {
            const profile = await getUserProfile(idToken);
            if (!isUserAlreadyRegistered(profile.username, profile.email)) {
                return Responses.NOT_REGISTERED_YET;
            }
            this.setRedis(username, JSON.stringify({
                loggedIn: true,
                ws,
            }));
            return Responses.OK;
        } catch (error) {
            return Responses.INVALID_TOKEN;
        }
    }
};
