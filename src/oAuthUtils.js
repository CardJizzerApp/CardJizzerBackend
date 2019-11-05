const {OAuth2Client} = require('google-auth-library');

const User = require('./models/user');

const env = require('./environment').getEnvironment();

/**
 * Fetches user profile data.
 * @param {string} idToken
 * @param {boolean} test
 * @return {TokenPayload}
 */
async function getUserProfile(idToken) {
    try {
        const clientId = test ?
            env.GOOGLE_OAUTH_CLIENT_ID :
            env.TESTENV.GOOGLE_OAUTH_CLIENT_ID;
        const client = new OAuth2Client(
            clientId,
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
};
exports.getUserProfile = getUserProfile;
/**
 * Checks whether the token is valid or not.
 * @param {string} idToken
 */
async function isTokenValid(idToken) {
    try {
        await this.getUserProfile(idToken);
        return true;
    } catch (err) {
        return false;
    }
};
exports.isTokenValid = isTokenValid;
/**
 * Checks whether a user is already existant.
 * @param {string} username
 * @param {string} email
 * @return {boolean}
 */
async function isUserAlreadyRegistered(username, email) {
    await User.findOne({
        $or: [
            {username},
            {email},
        ],
    }, (err, user) => {
        if (err || user === undefined) {
            return false;
        }
        return true;
    });
};
exports.isUserAlreadyRegistered = isUserAlreadyRegistered;
