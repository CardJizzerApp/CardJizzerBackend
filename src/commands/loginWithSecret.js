const {Command} = require('../command');
const {allUsers} = require('../userUtils');

const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

exports.loginWithSecret = class extends Command {
    /**
     * loginwithsecret [uuid: string] [secret: string]
     */
    constructor() {
        super('loginwithsecret', 2);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        const uuidGiven = args[0];
        const secretCodeGiven = args[1];
        for (let i = 0; i !== allUsers.length; i++) {
            const player = allUsers[i];
            if (player.uuid.toLowerCase() === uuidGiven.toLowerCase() &&
                secretCodeGiven === player.secretCode) {
                player.websocket = ws;
                return ech.sendResponse(Responses.OK, {newUsername: args[0]});
            }
        }
        return ech.sendResponse(Responses.WRONG_SECRET_CODE, null);
    }
};
