const mongoose = require('mongoose');

const env = require('./environment').getEnvironment();

/**
 * @param {{
*   websocket,
*   commandObject: {command: string, params: {}}}} testObject
* @param {{errorCode: any, jsonData: any}} expectedOutput
* @return {Promise}
*/
function sendCommandAndExpect(testObject, expectedOutput) {
    return new Promise((resolve) => {
        const {websocket, commandObject} = testObject;
        websocket.once('message', (msg) => {
            const response = JSON.parse(msg);
            expect(response.errorCode).to.be.oneOf(expectedOutput.errorCode);
            if (expectedOutput.jsonData !== undefined) {
                expect(response.errorCode).to.be.eql(expectedOutput.jsonData);
            }
            resolve(response);
        });
        websocket.send(JSON.stringify(commandObject));
    });
}
exports.sendCommandAndExpect = sendCommandAndExpect;
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
