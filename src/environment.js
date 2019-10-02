module.exports.getEnvironment = () => {
    return process.env.NODE_ENV === 'prod' ?
        this.ProductionEnvironment :
        this.DevelopmentEnvironment;
};

module.exports.ProductionEnvironment = {
    GOOGLE_OAUTH_CLIENT_ID:
        '407408718192.apps.googleusercontent.com',
    MONGO_DATABASE: 'cardjizzer-production',
    MONGO_HOST: 'mongo',
    MONGO_PORT: 27017,
    PORT: 443,
    REDIS_HOST: 'redis',
    REDIS_PORT: 6379,
    TESTENV: {
        // eslint-disable-next-line
        GOOGLE_ACCESS_TOKEN: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjJiZjg0MThiMjk2M2YzNjZmNWZlZmRkMTI3YjJjZWUwN2M4ODdlNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTA5ODYwMjE5Mjc2MDQ3OTk4MDAiLCJlbWFpbCI6ImlqdXN0ZGV2Z2NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJBMjQ1SGlRb1dJWDVnMW1sempDbGl3IiwiaWF0IjoxNTY4NjI0ODUxLCJleHAiOjE1Njg2Mjg0NTF9.LKAwPjbo81zJwXX5uMWG2YztOKsRAMZXlatf0IHrGLHLVcWTHZ1uWFzU7zqGGos64hdrfpRoeAMJQvVIU_oNVlhZ1Gfyy4Tvj0LFueZsojG5wr3tvldYDqubB0N_xLUxcRKkN0k14qUOeEwm15a2j2eU9fJFyYQnNga0tHwAqMAJWLS5pUpPm6NdsvQlJA0J_pUKbXksc4ecbgc8N0IUk6Cki-JZIY1HNI8rK_LQiIFkc22xmrL4aNe2tZxRZ2s6CjTgy0uCjTwzqCwxFbH3WZ8K-74JUPyPyAmAzEXotorJLvpD7QRzjc7POXMcEgsRCESOlwQaF6ErKgCTGMnEvQ',
        GOOGLE_OAUTH_CLIENT_ID:
            '407408718192.apps.googleusercontent.com',
        OAUTH_TESTS: false,
    },
    TYPE: 'prod',
};

module.exports.DevelopmentEnvironment = {
    GOOGLE_OAUTH_CLIENT_ID:
        '407408718192.apps.googleusercontent.com',
    MONGO_DATABASE: 'cardjizzer-testdb',
    MONGO_HOST: 'localhost',
    MONGO_PORT: 27017,
    PORT: 80,
    REDIS_HOST: '192.168.99.100',
    REDIS_PORT: 6379,
    TESTENV: this.ProductionEnvironment.TESTENV,
    TYPE: 'dev',
};
