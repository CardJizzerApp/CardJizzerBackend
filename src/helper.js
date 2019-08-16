exports.ErrorCodeHelper = class {

    sendResponse(response, jsonData) {
        return JSON.stringify({
            errorCode: response.errorCode,
            message: response.message,
            jsonData: jsonData,
        });
    }
}


exports.Responses = {
    OK: {errorCode: 0, message: "OK"},
    COMMAND_NOT_FOUND: {errorCode: 1, message: "Command not found."},
    INVALID_USAGE: {errorCode: 2, message: "Invalid usage."},
    NAME_ALREADY_TAKEN: {errorCode: 3, message: "Username has already taken."},
    NOT_LOGGED_IN: {errorCode: 4, message: "Not logged in!"},
    NOT_INGAME: {errorCode: 5, message: "Not ingame"}
};