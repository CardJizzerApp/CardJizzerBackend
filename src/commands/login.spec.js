const {expect} = require('chai');

const {Responses} = require('../helper');
const {Login} = require('../command');
const {App} = require('../app');

const env = require('../environment').getEnvironment();

const testClass = new Login();

describe('Login Tests', () => {
    let app;
    before((done) => {
        app = new App();
        app.start().then(() => done());
    });
    it('Login with invalid token should return false', async () => {
        const response = JSON.parse(await testClass.login(undefined, ''));
        expect(response.errorCode).to.be.eql(Responses.INVALID_USAGE.errorCode);
    });
    it('Login with valid token should return true', async () => {
        if (env.TESTENV.OAUTH_TESTS) {
            const response = JSON.parse(await testClass.login(
                undefined,
                env.TESTENV.GOOGLE_ACCESS_TOKEN));
            expect(response).to.be.eql(responses.OK);
        }
    });
    after(() => {
        app.stop();
    });
});
