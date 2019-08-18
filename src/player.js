const allUsers = [];
exports.allUsers = allUsers;

exports.Player = class {

    constructor(websocket, username) {
        this.uuid = websocket.uuid;
        this.websocket = websocket;
        this.username = username;
        this.currentGameUUID = -1;
        allUsers.push(this);
    }

    playCard(carduuid) {
        if (this.currentGameUUID === -1) {
            return false;
        }
        const {getGameByUUID, GameState} = require("./game");
        const game = getGameByUUID(this.currentGameUUID);
        if (game === undefined || game.state !== GameState.INGAME) {
            return false;
        }
        const hand = game.getCardsOfPlayer(this);
        for (let i = 0; i !== hand.length; i++) {
            const card = hand[i];
            if (card.uuid === carduuid) {
                if (game.round.playCard(this, card)) {
                    game.playerCardStacks[this.uuid] = removeItem(game.playerCardStacks[this.uuid], i);
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * @return {boolean}
     */
    join(gameUUID) {
        if (this.currentGameUUID !== -1) {
            return false;
        }
        const {getGameByUUID} = require("./game");

        const game = getGameByUUID(gameUUID);
        for (let i = 0; i !== game.players.length; i++) {
            const player_i = game.players[i];
            if (player_i === this) {
                return false;
            }
        }
        game.addToGame(this);
        return true;
    }

}
// exports.Player = player;

/**
 * @return {Player}
 */
const getPlayerByUUID = function(uuid) {
    for (let i = 0; i !== allUsers.length; i++) {
        const player = allUsers[i];
        const p_uuid = player.uuid;
        if (uuid === p_uuid) {
            return player;
        }
    }
    return undefined;
}
exports.getPlayerByUUID = getPlayerByUUID;

const removeItem = function(arr, index) {
    const newArr = []
    for (let i = 0; i !== arr.length; i++) {
        if (i === index) continue;
        newArr.push(arr[i]);
    }
    return newArr;
}
exports.removeItem = removeItem;