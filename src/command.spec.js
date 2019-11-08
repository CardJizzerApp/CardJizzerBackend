const ChaiS = require('chai');
const assert = ChaiS.assert;
const expect = ChaiS.expect;
const Ws = require('ws');

const {App} = require('./app');

const {
    connectToEmptyDatabase,
    disconnectDatabase,
    mockUsersForTest,
} = require('./testUtils');

/**
 * @param {
*  {websocket,
*  commandObject: {command: string, params: {}}}} testObject
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
module.exports.sendCommandAndExpect = sendCommandAndExpect;

/* eslint-disable max-lines-per-function */
describe('commandTests', () => {
    let app;
    let player2; let websocket;
    before((done) => {
        app = new App();
        connectToEmptyDatabase().then(async () => {
            await mockUsersForTest();
            await app.start();
            websocket = new Ws('ws://localhost:' + app.Port);
            player2 = new Ws('ws://localhost:' + app.Port);
            done();
        });
    });
    it('should return true', () => {
        return assert(true);
    });
    it('login', async () => {
        const commandObject = {
            command: 'login',
            params: {
                // Using database users | not Google OAuth - for further information visit: https://github.com/CardJizzerApp/CardJizzerBackend/issues/5
                loginData: {
                    password: 'test',
                    username: 'test',
                },
            },
        };
        await sendCommandAndExpect(
            {commandObject, websocket},
            {errorCode: [0]},
        );
        commandObject.params.loginData.username = 'test2';
        await sendCommandAndExpect(
            {commandObject, websocket: player2},
            {errorCode: [0]},
        );
    });
    it('fetchGames', async () => {
        const commandObject = {
            command: 'fetchgames',
        };
        await sendCommandAndExpect(
            {commandObject, websocket},
            {errorCode: [0]},
        );
    });
    let gameUUID;
    it('createGame', async () => {
        const commandObject = {
            command: 'creategame',
            params: {
                deckids: ['SFG96'],
                gametitle: 'Samplegame',
                maxplayers: 4,
                maxroundtime: 240,
                password: 'Testpassword',
                pointstowin: 8,
            },
        };
        await sendCommandAndExpect(
            {commandObject, websocket},
            {errorCode: [0, 1000108]},
        );
    });
    it('fetchGames after creation', (done) => {
        const commandObject = {
            command: 'fetchgames',
        };
        sendCommandAndExpect(
            {commandObject, websocket},
            {errorCode: [0]},
        ).then((response) => {
            gameUUID = response.jsonData[0].id;
            done();
        });
    });
    it('joinGame', async () => {
        const commandObject = {
            command: 'join',
            params: {
                gameid: gameUUID,
            },
        };
        await sendCommandAndExpect(
            {commandObject, websocket},
            {errorCode: [7, 1000113]},
        );
        await sendCommandAndExpect(
            {commandObject, websocket: player2},
            {errorCode: [0, 1000108]},
        );
    });
    it('startGame', async () => {
        await sendCommandAndExpect(
            {commandObject: {command: 'start'}, websocket},
            {errorCode: [0]},
        );
    });
    const cardUUIDs = [];
    it('fetchCards and save cardUUIDs', (done) => {
        sendCommandAndExpect(
            {commandObject: {command: 'fetchcards'}, websocket: websocket},
            {errorCode: [0]},
        );
        sendCommandAndExpect(
            {commandObject: {command: 'fetchcards'}, websocket: player2},
            {errorCode: [0]},
        ).then((response) => {
            response.jsonData.forEach((card) => {
                cardUUIDs.push(card.uuid);
            });
            done();
        });
    });
    it('playcard', async () => {
        const commandObject = {
            command: 'playcard',
            params: {
                cardid: cardUUIDs[0],
            },
        };
        await sendCommandAndExpect(
            {commandObject, websocket: player2},
            {errorCode: [0, 1000101]},
        );
    });
    let cardToPick = undefined;
    it('fetchallcards', (done) => {
        const commandObject = {
            command: 'fetchallcards',
        };
        sendCommandAndExpect(
            {commandObject, websocket},
            {errorCode: [0]},
        ).then((response) => {
            const jsonData = response.jsonData;
            cardToPick = jsonData[Object.keys(jsonData)[0]][0].uuid;
            done();
        });
    });
    it('pickcard', () => {
        const commandObject = {
            command: 'pickcard',
            params: {
                cardid: cardToPick,
            },
        };
        sendCommandAndExpect(
            {commandObject, websocket},
            {errorCode: [1000102, 0]},
        );
    });
    it('register', async () => {
        const commandObject = {
            command: 'registeruser',
            params: {
                email: 'testuser@gmail.com',
                idToken: 'asdf',
                password: 'test',
                username: 'test',
            },
        };
        await sendCommandAndExpect(
            {commandObject, websocket},
            {errorCode: [16]},
        );
    });
    after((done) => {
        disconnectDatabase().then(() => {
            app.stop();
            done();
        });
    });
});
