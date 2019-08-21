const {getGameByUUID, GameState} = require('./game');

const allUsers = [];
module.exports.allUsers = allUsers;

const player = class {
    /**
     * @param {Websocket} websocket
     * @param {string} username
     */
    constructor(websocket, username) {
        this.uuid = websocket.uuid;
        this.websocket = websocket;
        this.username = username;
        this.currentGameUUID = -1;
        allUsers.push(this);
    }
    /**
     * @param {string} carduuid
     * @return {boolean} succeed
     */
    playCard(carduuid) {
        if (this.currentGameUUID === -1) {
            return false;
        }
        const game = getGameByUUID(this.currentGameUUID);
        if (game === undefined || game.state !== GameState.INGAME) {
            return false;
        }
        const hand = game.getCardsOfPlayer(this);
        for (let i = 0; i !== hand.length; i++) {
            const card = hand[i];
            if (card.uuid === carduuid) {
                if (game.round.playCard(this, card)) {
                    game.playerCardStacks[this.uuid] =
                        removeItem(game.playerCardStacks[this.uuid], i);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @param {string} gameUUID
     * @return {boolean}
     */
    join(gameUUID) {
        if (this.currentGameUUID !== -1) {
            return false;
        }
        const game = getGameByUUID(gameUUID);
        for (let i = 0; i !== game.players.length; i++) {
            const playerI = game.players[i];
            if (playerI === this) {
                return false;
            }
        }
        game.addToGame(this);
        return true;
    }
};

module.exports.Player = player;

/**
 * @param {string} uuid
 * @return {Player}
 */
const getPlayerByUUID = function(uuid) {
    for (let i = 0; i !== allUsers.length; i++) {
        const player = allUsers[i];
        const pUUID = player.uuid;
        if (uuid === pUUID) {
            return player;
        }
    }
    return undefined;
};
module.exports.getPlayerByUUID = getPlayerByUUID;

const removeItem = function(arr, index) {
    const newArr = [];
    for (let i = 0; i !== arr.length; i++) {
        if (i === index) continue;
        newArr.push(arr[i]);
    }
    return newArr;
};
module.exports.removeItem = removeItem;
