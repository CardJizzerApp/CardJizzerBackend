module.exports.ErrorCodeHelper = class {
    /**
     * @param {Response} response
     * @param {object} jsonData
     * @return {string}
     */
    sendResponse(response, jsonData) {
        return JSON.stringify({
            errorCode: response.errorCode,
            jsonData: jsonData,
            message: response.message,
        });
    }
};


/* eslint-disable */
module.exports.Responses = {
    OK: {errorCode: 0, message: 'OK'},
    COMMAND_NOT_FOUND: {errorCode: 1, message: 'Command not found.'},
    INVALID_USAGE: {errorCode: 2, message: 'Invalid usage.'},
    NAME_ALREADY_TAKEN: {errorCode: 3, message: 'Username is already in use.'},
    NOT_LOGGED_IN: {errorCode: 4, message: 'Not logged in!'},
    NOT_INGAME: {errorCode: 5, message: 'Not ingame'},
    GAME_NOT_FOUND: {errorCode: 6, message: 'Game not found!'},
    COULD_NOT_JOIN: {errorCode: 7, message: 'Game could not be joined!'},
    GAME_ALREADY_INGAME: {errorCode: 8, message: 'Game already ingame!'},
    CARD_COULD_NOT_BE_PLAYED:
        {errorCode: 9, message: 'Card could not be found!'},
    NOT_CARD_JIZZER: {errorCode: 10, message: 'You are not card jizzer'},
    PLAYERS_NEED_TO_PICK_FIRST:
        {errorCode: 11, message: 'Players need to pick first.'},
    PICK_PHASE_OVER: {errorCode: 12, message: 'Pick phase already over'},
    CARD_COULD_NOT_BE_PICKED:
        {errorCode: 13, message: 'Card could not be picked.'},
    WRONG_SECRET_CODE: {errorCode: 14, message: 'Wrong secret code'},
    INVALID_JSON: {errorCode: 15, message: 'JSON invalid'},
    INVALID_TOKEN: {errorCode: 16, message: 'Invalid OAuth token'},
    NOT_REGISTERED_YET: {errorCode: 17, message: 'Not registered yet'},
    ALREADY_INGAME: {errorCode: 18, message: 'You are already ingame.'},
    NOT_LOBBY_OWNER: {errorCode: 19, message: 'You are not the lobby owner.'},
    // Event Responses
    CARD_PLAYED: {errorCode: 1000101, message: 'Player played card!'},
    CARD_JIZZER_PICKED: {errorCode: 1000102, message: 'Cardjizzer picked!'},
    PLAYER_JOINED: {errorCode: 1000103, message: 'Player joined!'},
    GAME_STARTED: {errorCode: 1000104, message: 'Game started!'},
    GAME_OVER: {errorCode: 1000105, message: 'Game over!'},
    NEW_ROUND_STARTED: {errorCode: 1000106, message: 'New round has started!'},
    CARDS_FLIPPED: {errorCode: 1000107, message: 'Cards flipped!'},
    GAME_CREATED_EVENT: {errorCode: 1000108, message: 'A new game was created!'},
    PING: {errorCode: 1000000, message: 'Ping'},
};
/* eslint-enable */
