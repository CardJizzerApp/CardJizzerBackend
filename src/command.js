const {ErrorCodeHelper, Responses} = require("./helper");
const {allGames, allUsers, Game} = require("./game");

const allCommands = [];

const ech = new ErrorCodeHelper();

exports.Command = class {

    constructor(commandname, argsLength) {
        this.commandname = commandname;
        this.argsLength = argsLength;
        allCommands.push(this);
    }

    run(args, ws) {}
}

const fetchGames = class extends this.Command {
    
    // fetchgames
    constructor() {
        super("fetchgames", 0);
    }

    run(args) {
        const allGamesToServe = [];
        for (let i = 0; i !== allGames.length; i++) {
            const game = allGames[i];
            game.password = undefined;
            game.players = undefined;
            allGamesToServe.push(game);
        }
        return ech.sendResponse(Responses.OK, allGamesToServe);
    }

}

const createGame = class extends this.Command {

    // creategame [maxplayers: int] [cardcast-deck-ids: array[number]] [password: string] [pointsToWin: number] [maxRoundTime: number] 
    // if no password: [password: string] = false
    constructor() {
        super("creategame", 4);
    }

    run(args) {
        const maxPlayers = args[0];
        const deckIds = args[1];
        const password = args[2];
        const passwordRequired = password !== "false";
        const pointsToWin = args[3];
        const maxRoundTime = args[4];

        return ech.sendResponse(Responses.OK, []);
    }

}

const setUsername = class extends this.Command {

    // setusername [username: string]
    constructor() {
        super("setusername", 1);
    }

    run(args, ws) {
        const usernameGiven = args[0];
        const usernameValues = Object.values(allUsers);
        for (let i = 0; i !== usernameValues.length; i++) {
            const test = [];
            const username = usernameValues[i].toLowerCase();
            if (usernameGiven.toLowerCase() === username) {
                return ech.sendResponse(Responses.NAME_ALREADY_TAKEN, null);
            }
        }
        allUsers[ws.uid] = usernameGiven;
        return ech.sendResponse(Responses.OK, {newUsername: args[0]});
    }

}

const logout = class extends this.Command {

    constructor() {
        super("logout", 0);
    }

    run(args, ws) {
        delete allUsers[ws.uid];
        console.log(allUsers);
        return "Logged out successfully!";
    }
    
}

const join = class extends this.Command {
    
    // join [gameUUID: string]    
    constructor() {
        super("join", 1);
    }

    run(args, ws) {

    }

}

exports.registerCommands = function() {
    new createGame();
    new fetchGames();
    new setUsername();
    new logout();
}

exports.findCommand = function(commandname) {
    for (let i = 0; i !== allCommands.length; i++) {
        const command = allCommands[i];
        if (command.commandname === commandname) {
            return command;
        }
    }
}