const mongoose = require('mongoose');

const env = require('./environment').getEnvironment();


exports.sendCommandAndExpect = require('./testUtils').sendCommandAndExpect;
/**
 * Connects to a database and drops the database
 * @return {Promise}
 */
function connectToEmptyDatabase() {
    return new Promise((resolve) => {
        mongoose.connection.close(() => {
            mongoose.connect(
                `mongodb://${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
                () => {
                    mongoose.connection.db.dropDatabase(() => {
                        console.log('[*] Connected to empty database');
                        resolve();
                    });
                },
            );
        });
    });
}
exports.connectToEmptyDatabase = connectToEmptyDatabase;

/**
 * Disconnect database
 * @return {Promise}
 */
function disconnectDatabase() {
    return new Promise((resolve) => {
        mongoose.connection.close(() => {
            resolve();
        });
    });
}
exports.disconnectDatabase = disconnectDatabase;
