const {ErrorCodeHelper, Responses} = require("./helper");
const {allGames, allUsers, getPlayerByUUID, Player, getGameByUUID, GameState} = require("./game");

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
        for (let i = 0; i!== allUsers.length; i++) {
            const player = allUsers[i];
            if (player.username.toLowerCase() === usernameGiven.toLowerCase()) {
                return ech.sendResponse(Responses.NAME_ALREADY_TAKEN, null);
            } 
        }
        if (getPlayerByUUID(ws.uuid) === undefined) {
            new Player(ws, usernameGiven);
        } else {
            getPlayerByUUID(ws.uuid).username = usernameGiven;

        }
        return ech.sendResponse(Responses.OK, {newUsername: args[0]});
    }

}

const logout = class extends this.Command {

    constructor() {
        super("logout", 0);
    }

    run(args, ws) {
        for (let i = 0; i !== allUsers.length; i++) {
            const player = allUsers[i];
            if (player.uuid === ws.uuid) {
                allUsers.splice(i, 1);
                return ech.sendResponse(Responses.OK, null);        
            }
        }
        return ech.sendResponse(Responses.NOT_LOGGED_IN, null);        
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

const playCard = class extends this.Command {

    // playcard [cardUUID: string]
    constructor() {
        super("playCard", 1);
    }

    run(args, ws) {

    }

}

const selectCard = class extends this.Command {

    // selectcard [cardUUID: string]
    constructor() {
        super("selectcard", 1);
    }

    run(args, ws) {
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        if (player.currentGameUUID === -1) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        const game = getGameByUUID(player.currentGameUUID);
        if (game === undefined || game.state !== GameState.INGAME) {
            return ech.sendResponse(Responses.NOT_INGAME);
        }
        const hand = game.playerCardStacks[player];
        player.playCard(args[1]);
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