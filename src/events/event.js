exports.Event = class {
    /**
     * Abstract function
     */
    trigger() {}
    /**
     * Send a response to all game members
     * @param {game} game
     * @param {string} data
     */
    sendToGameMembers(game, data) {
        game.players.forEach((player) => {
            player.websocket.send(data);
        });
    }
};
