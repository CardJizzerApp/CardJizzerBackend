const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');
const {allUsers} = require('../player');

const ech = new ErrorCodeHelper();

exports.ChangeAction = {
    GAME_CREATED: 1,
    PLAYER_JOINED: 2,
    PLAYER_LEFT: 3,
    GAME_REMOVED: 4,
};

exports.GameChangedEvent = class extends Event {
    /**
     * @param {*} jsonData
     * @param {ChangeAction} action
     */
    trigger(jsonData, action) {
        for (let i = 0; i !== allUsers.length; i++) {
            const player = allUsers[i];
            const websocket = player.websocket;
            websocket.send(ech.sendResponse(
                Responses.GAME_CREATED_EVENT,
                {action, jsonData}));
        }
    }
};
