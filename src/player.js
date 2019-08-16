const {getGameByUUID, GameState} = require("./game");


const allUsers = [];
exports.allUsers = allUsers;

const player = class {

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
        const game = getGameByUUID(this.currentGameUUID);
        if (game === undefined || game.state !== GameState.INGAME) {
            return false;
        }
        const hand = game.playerCardStacks[player];
        for (let i = 0; i !== hand.length; i++) {
            const card = hand[i];
            if (card.uuid === carduuid) {
                console.log("Played");
            }
            return false;
        }
    }

    join(gameUUID) {
        if (this.currentGameUUID !== -1) {
            return false;
        }
        const game = getGameByUUID(gameUUID);
        for (let i = 0; i !== game.players.length; i++) {
            const player_i = game.players[i];
            if (player_i === this) {
                return false;
            }
        }

        return game.addToGame(this);
    }

}
exports.Player = player;

exports.getPlayerByUUID = function(uuid) {
    for (let i = 0; i !== allUsers.length; i++) {
        const player = allUsers[i];
        const p_uuid = player.uuid;
        if (uuid === p_uuid) {
            return player;
        }
    }
    return undefined;
}
