const assert = require("chai").assert;
const ws = require("ws");
const {stopServer} = require("./server");

describe('commandTests', () => {
    let websocket, player2;
    before(() => {
        require("./server");
        websocket = new ws("ws://localhost:83");
        player2 = new ws("ws://localhost:83");
    })
    it("should return true", () => {
        return assert(true);
    });
    it ("setUsername // login", () => {
        websocket.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            assert.equal(errorCode, 0);
        });
        player2.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            assert.equal(errorCode, 0);
        })
        websocket.send("setusername test");
        player2.send("setusername test2");
    });
    it ("fetchGames", () => {
        websocket.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            assert.equal(errorCode, 0);
        });
        websocket.send("fetchgames");
    });
    it ("createGame", () => {
        const maxPlayers = 4;
        websocket.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            const maxPlayersJson = JSON.parse(msg).jsonData.maxplayers;
            assert.equal(errorCode, 0);
            assert.equal(maxPlayersJson, maxPlayers);
        });
        websocket.send("creategame " + maxPlayers + " 0 false 20");
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
        websocket.send("fetchgames");
    });
    it("joinGame", () => {
        websocket.once("message", msg => {
            const errorCode = JSON.parse(msg).errorCode;
            assert.equal(errorCode, 7);
        });
        websocket.send("join " + gameUUID);
        player2.once("message", msg => {
            assert("")
        })
    });
    after(() => {
        stopServer();
    });
});