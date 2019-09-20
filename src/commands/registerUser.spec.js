const {expect} = require('chai');

const env = require('../environment').getEnvironment();

const User = require('../models/user');
const {RegisterUser} = require('../command');

const {connectToEmptyDatabase, disconnectDatabase} = require('../testUtils');

const testClass = new RegisterUser();


describe('Register functions', () => {
    it('Register with invalid userObject should return false', async () => {
        const response = await testClass.registerUser({});
        expect(response).to.be.eql(false, 'UserObject can not be empty.');
    });
    it('Register with valid userObject should return true', async () => {
        if (env.TESTENV.OAUTH_TESTS) {
            const userObject = {
                idToken: env.TESTENV.GOOGLE_ACCESS_TOKEN,
                password: 'Testpassword',
                username: 'IJustDev',
            };
            const response = await testClass.registerUser(userObject);
            expect(response).to.be.eql(true, 'UserObject can not be empty.');
        }
    });
});

describe('Database functions', () => {
    before((done) => {
        connectToEmptyDatabase().then(() => done());
    });
    it('Databases should be updated by one', async () => {
        await User.find({}, async (err, users) => {
            expect(err).to.be.oneOf([undefined, null]);
            if (env.TESTENV.OAUTH_TESTS) {
                expect(users.length).to.be.eql(1);
            }
        });
    });
    after((done) => {
        disconnectDatabase().then(() => done());
    });
});
