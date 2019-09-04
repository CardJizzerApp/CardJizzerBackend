const ChaiS = require("chai");
const assert = ChaiS.assert;
const expect = ChaiS.expect;
const ws = require("ws");
const { stopServer, port } = require("./server");
const {allUsers} = require("./userUtils");

describe('commandTests', () => {
    let websocket, player2;
    before((done) => {
        require("./server");
        websocket = new ws("ws://localhost:" + port);
        player2 = new ws("ws://localhost:" + port);
        done();
    });
    it("should return true", () => {
        return assert(true);
    });
    it("setUsername // login", () => {
        websocket.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            assert.equal(errorCode, 0);
        });
        player2.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            assert.equal(errorCode, 0);
        })
        const commandObject = {
            command: "setusername",
            params: {
                username: "test",
            },
        }
        websocket.send(JSON.stringify(commandObject));
        commandObject.params.username = "test2";
        player2.send(JSON.stringify(commandObject));
    });
    it("fetchGames", () => {
        websocket.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            assert.equal(errorCode, 0);
        });
        const commandObject = {
            command: "fetchgames",
        };
        websocket.send(JSON.stringify(commandObject));
    });
    it("createGame", () => {
        const maxPlayers = 4;
        websocket.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            const maxPlayersJson = JSON.parse(msg).jsonData.maxplayers;
            expect(errorCode).to.be.oneOf([0, 100108]);
            if (errorCode === 0) {
                assert.equal(maxPlayersJson, maxPlayers);
            }
        });
        const commandObject = {
            command: "creategame",
            params: {
                maxplayers: maxPlayers,
                deckids: ['3723A', '23kck'],
                password: 'Testpassword',
                pointstowin: 8,
                maxroundtime: 240,
                gametitle: 'Samplegame'
            }
        }
        websocket.send(JSON.stringify(commandObject));
    });
    let gameUUID;
    it("fetchGames after creation", () => {
        websocket.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            const games = JSON.parse(msg).jsonData;
            assert.equal(errorCode, 0);
            assert.equal(games.length, 1);
            gameUUID = games[0].id;
        });
        const commandObject = {
            command: "fetchgames"
        };
        websocket.send(JSON.stringify(commandObject));
    });
    it("joinGame", () => {
        websocket.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            expect(errorCode).to.be.oneOf([7, 1000113]);
        });
        const commandObject = {
            command: "join",
            params: {
                gameid: gameUUID,
            },
        };
        websocket.send(JSON.stringify(commandObject));

        player2.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            expect(errorCode).to.be.oneOf([0, 100108]);
        });
        player2.send(JSON.stringify(commandObject));
    });
    it("startGame", (done) => {
        websocket.once("message", async (msg) => {
            const errorCode = JSON.parse(msg).errorCode;
            assert.equal(errorCode, 0);
            done();
        });
        const commandObject = {
            command: "start",
        };
        websocket.send(JSON.stringify(commandObject));
    });
    let carduuid = undefined;
    let carduuid2 = undefined;
    let carduuid3 = undefined;
    it("fetchCards", () => {
        player2.once("message", msg => {
            const response = JSON.parse(msg);
            const errorCode = response.errorCode;
            const cards = response.jsonData;
            assert.equal(errorCode, 0);
            assert.isAbove(cards.length, 0);
            carduuid = cards[0].uuid;
            carduuid2 = cards[1].uuid;
            carduuid3 = cards[2].uuid;
        });
        const commandObject = {
            command: "fetchcards",
        };
        player2.send(JSON.stringify(commandObject));
    });
    it("playcard", (done) => {
        player2.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            expect(errorCode).to.be.oneOf([1000101, 0, 1000107]);
            done();
        });
        const commandObject = {
            command: "playcard",
            params: {
                cardid: carduuid
            }
        }
        player2.send(JSON.stringify(commandObject));
        commandObject.params.cardid = carduuid2;
        player2.send(JSON.stringify(commandObject));
        commandObject.params.cardid = carduuid3;
        player2.send(JSON.stringify(commandObject));
    });
    let cardToPick = undefined;
    it("fetchallcards", () => {
        websocket.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            assert.equal(errorCode, 0);
            const jsonData = JSON.parse(msg).jsonData;
            cardToPick = jsonData[Object.keys(jsonData)[0]][0];
        });
        const commandObject = {
            command: "fetchallcards"
        };
        websocket.send(JSON.stringify(commandObject));
    });
    it("pickcard", () => {
        player2.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            assert.equal(errorCode, 10);
        });
        websocket.on("message", msg => {
            const response = JSON.parse(msg);
            const errorCode = response.errorCode;
            expect(errorCode).to.be.oneOf([1000102, 0]);
        });
        const commandObject = {
            command: "pickcard",
            params: {
                cardid: "somenonesense",
            },
        };
        player2.send(JSON.stringify(commandObject));
        commandObject.params.cardid = cardToPick.uuid;
        websocket.send(JSON.stringify(commandObject));
    });
    it("logout", () => {
        expect(allUsers.length).to.be.eql(2);
        websocket.close();
    });
    after(() => {
        stopServer();
    });
});