const allCommands = [];

exports.Command = class {

    constructor(commandname, argsLength, async) {
        this.commandname = commandname;
        this.argsLength = argsLength;
        this.async = async;
        allCommands.push(this);
    }

    run(args, ws) { }
}

const { createGame } = require("./commands/createGame");
const { fetchAllPickedCards } = require("./commands/fetchAllPickedCards");
const { fetchCards } = require("./commands/fetchCards");
const { fetchGames } = require("./commands/fetchGames");
const { join } = require("./commands/join");
const { logout } = require("./commands/logout");
const { pickCard } = require("./commands/pickCard");
const { playCard } = require("./commands/playCard");
const { setUsername } = require("./commands/setUsername");
const { start } = require("./commands/start");


exports.registerCommands = function () {
    new createGame("", 0, false);
    new fetchGames();
    new setUsername();
    new logout();
    new join();
    new playCard();
    new start();
    new fetchCards();
    new pickCard();
    new fetchAllPickedCards();
}

exports.findCommand = function (commandname) {
    for (let i = 0; i !== allCommands.length; i++) {
        const command = allCommands[i];
        if (command.commandname === commandname) {
            return command;
        }
    }
}