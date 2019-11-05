const testClass = require('./oAuthUtils');

const env = require('./environment').getEnvironment();

const {expect}= require('chai');

describe('Token functions', () => {
    it(
        'Check token function with valid token should return true',
        async () => {
            if (env.TESTENV.OAUTH_TESTS) {
                const response = await testClass.isTokenValid(
                    env.TESTENV.GOOGLE_ACCESS_TOKEN);
                expect(response).true;
            }
        },
    );
    it(
        'Check token function with invalid token should return false',
        async () => {
            expect(await testClass.isTokenValid('notoken')).false;
        },
    );
});
