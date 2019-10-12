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
    SENTRYDSN: process.env.SENTRYDSN,
    TESTENV: {
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
    MONGO_HOST: process.env.MONGO_HOST,
    MONGO_PORT: process.env.MONGO_PORT,
    PORT: process.env.PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    SENTRYDSN: process.env.SENTRYDSN,
    TESTENV: this.ProductionEnvironment.TESTENV,
    TYPE: 'dev',
};
