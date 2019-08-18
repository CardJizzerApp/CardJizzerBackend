const {ErrorCodeHelper, Responses} = require("./helper");
const {allGames, getGameByUUID, GameState, Game} = require("./game");
const {Round, phaseState} = require("./round");

const {getPlayerByUUID, Player, allUsers} = require("./player");

const allCommands = [];

const ech = new ErrorCodeHelper();

exports.Command = class {

    constructor(commandname, argsLength, async) {
        this.commandname = commandname;
        this.argsLength = argsLength;
        this.async = async;
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
            const game = JSON.parse(JSON.stringify(allGames[i]));
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

    run(args, ws) {
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        const maxPlayers = args[0];
        const deckIds = args[1];
        const password = args[2];
        const passwordRequired = password !== "false";
        const pointsToWin = args[3];
        const maxRoundTime = args[4];
        const game = new Game(maxPlayers, ['SFG96'], password, pointsToWin, maxRoundTime);
        player.join(game.id);
        return ech.sendResponse(Responses.OK, game);
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
        const gameUUID = args[0];
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        const game = getGameByUUID(gameUUID);
        if (game === undefined || game.state === GameState.STOPPED) {
            return ech.sendResponse(Responses.GAME_NOT_FOUND, null);
        }
        if (game.state === GameState.INGAME) {
            return ech.sendResponse(Responses.NOT_INGAME, null)
        }
        if (player.join(game.id)) {
            return ech.sendResponse(Responses.OK, null);
        } 
        return ech.sendResponse(Responses.COULD_NOT_JOIN, null);

    }

}

const playCard = class extends this.Command {

    // playcard [cardUUID: string]
    constructor() {
        super("playcard", 1);
    }

    run(args, ws) {
        const cardUUID = args[0];
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        const game = getGameByUUID(player.currentGameUUID);
        if (game === undefined || game.state !== GameState.INGAME) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        const round = game.round;
        if (round.phase === phaseState.SelectCard) {
            return ech.sendResponse(Responses.PICK_PHASE_OVER, null);
        }
        if (player.playCard(cardUUID)) {
            return ech.sendResponse(Responses.OK, null);
        }
        return ech.sendResponse(Responses.CARD_COULD_NOT_BE_PLAYED, null);
    }

}

const pickCard = class extends this.Command {

    // selectcard [cardUUID: string]
    constructor() {
        super("pickcard", 1);
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
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        if (game.round.cardJizzer.uuid !== player.uuid) {
            return ech.sendResponse(Responses.NOT_CARD_JIZZER, null);
        }
        const pickable = getGameByUUID(player).round.allCards;
        console.log(pickable);
        player.playCard(args[1]);
    }
}

const start = class extends this.Command {

    constructor() {
        super("start", 0, true);
    }

    async run(args, ws) {
        const player = getPlayerByUUID(ws.uuid);
        if (player === undefined) {
            return ech.sendResponse(Responses.NOT_LOGGED_IN, null);
        }
        if (player.currentGameUUID === -1) {
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        const game = getGameByUUID(player.currentGameUUID);
        if (game === undefined || game.state !== GameState.LOBBY) {
            return ech.sendResponse(Responses.GAME_ALREADY_INGAME, null);
        }
        return game.start().then(() => {
            return ech.sendResponse(Responses.OK, game);
        });
    }

}

const fetchCards = class extends this.Command {

    constructor() {
        super("fetchcards", 0);
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
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        const hand = game.getCardsOfPlayer(player);
        return ech.sendResponse(Responses.OK, hand);
    }

}

const fetchAllPickedCards = class extends this.Command {

    constructor() {
        super("fetchAllCards", 0);        
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
            return ech.sendResponse(Responses.NOT_INGAME, null);
        }
        const round = game.round;
        if (round.phase === phaseState.PlayCards) {
            return ech.sendResponse(Responses.PLAYERS_NEED_TO_PICK_FIRST, null);
        }
        return ech.sendResponse(Responses.OK, game.round.allCards);
    }

}

exports.registerCommands = function() {
    new createGame();
    new fetchGames();
    new setUsername();
    new logout();
    new join();
    new playCard();
    new playCard();
    new start();
    new fetchCards();
    new pickCard();
    new fetchAllPickedCards();
}

exports.findCommand = function(commandname) {
    for (let i = 0; i !== allCommands.length; i++) {
        const command = allCommands[i];
        if (command.commandname === commandname) {
            return command;
        }
    }
}