const {Player} = require("./player");
const {ErrorCodeHelper, Responses} = require("./helper");
const {getGameByUUID} = require("./game");

const ech = new ErrorCodeHelper();

const events = [];

const Event = class {

    constructor() {
        events.push(this);
    }

    /**
     * 
     * @param {Player} player 
     */
    trigger(player) {}
    
}

const CardPlayedEvent = class extends Event {

    /**
     * 
     * @param {Player} player
     */
    trigger(player) {
        sendToAll(ech.sendResponse(Responses.CARD_PLAYED, player.uuid));
    }
}
module.exports.CardPlayedEvent = CardPlayedEvent;

const PlayerJoinedEvent = class extends Event {

    /**
     * 
     * @param {Player} player
     */
    trigger(player) {
        sendToAll(ech.sendResponse(Responses.PLAYER_JOINED, player));
    }
}
module.exports.PlayerJoinedEvent = PlayerJoinedEvent;

const CardJizzerPickedEvent = class extends Event {
    
    /**
     *
     * @param {Player} player 
     */
    trigger(player) {
        const game = getGameByUUID(player.currentGameUUID);
        sendToAll(ech.sendResponse(Responses.CARDS_FLIPPED, game.round.allCards));
    }
}
module.exports.CardJizzerPickedEvent = CardJizzerPickedEvent;


const sendToAll = function(player, message) {
    const game = getGameByUUID(player.currentGameUUID);
    for (let i = 0; i !== game.players.length; i++) {
        const playerI = game.players[i];
        if (playerI === player) continue;
        playerI.websocket.send(message);
    }
}