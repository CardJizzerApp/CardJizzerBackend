module.exports.ErrorCodeHelper = class {

    sendResponse(response, jsonData) {
        return JSON.stringify({
            errorCode: response.errorCode,
            message: response.message,
            jsonData: jsonData,
        });
    }
}


module.exports.Responses = {
    OK: {errorCode: 0, message: "OK"},
    COMMAND_NOT_FOUND: {errorCode: 1, message: "Command not found."},
    INVALID_USAGE: {errorCode: 2, message: "Invalid usage."},
    NAME_ALREADY_TAKEN: {errorCode: 3, message: "Username has already taken."},
    NOT_LOGGED_IN: {errorCode: 4, message: "Not logged in!"},
    NOT_INGAME: {errorCode: 5, message: "Not ingame"},
    GAME_NOT_FOUND: {errorCode: 6, message: "Game not found!"},
    COULD_NOT_JOIN: {errorCode: 7, message: "Game could not be joined!"},
    GAME_ALREADY_INGAME: {errorCode: 8, message: "Game already ingame!"},
    CARD_COULD_NOT_BE_PLAYED: {errorCode: 9, message: "Card could not be found!"},
    NOT_CARD_JIZZER: {errorCode: 10, message: "You are not card jizzer"},
    PLAYERS_NEED_TO_PICK_FIRST: {errorCode: 11, message: "Players need to pick first."},
    PICK_PHASE_OVER: {errorCode: 12, message: "Pick phase already over"},
    
    // Event Responses
    CARD_PLAYED: {errorCode: 101, message: "Player played card!"},
    CARDS_FLIPPED : {errorCode: 102, message: "Cards flipped!"},
    PLAYER_JOINED: {errorCode: 103, message: "Player joined!"},
    GAME_STARTED: {errorCode: 104, message: "Game started!"},
};