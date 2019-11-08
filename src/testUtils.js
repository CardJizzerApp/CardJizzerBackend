const mongoose = require('mongoose');

const env = require('./environment').getEnvironment();
const User = require('./models/user');

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
 * Adds two users to the database.
 * @return {Promise}
 */
function mockUsersForTest() {
    return new Promise(async (resolve) => {
        await User.create({
            email: 'test@mail.de',
            password: 'test',
            username: 'test',
        });
        await User.create({
            email: 'test2@mail.de',
            password: 'test',
            username: 'test2',
        });
        resolve();
    });
}
exports.mockUsersForTest = mockUsersForTest;

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
