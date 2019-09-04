const allCommands = [];

exports.Command = class {
    /**
     * @param {string} commandname
     * @param {object} requiredArgs
     * @param {boolean} async
     */
    constructor(commandname, requiredArgs, async) {
        this.commandname = commandname;
        this.requiredArgs = requiredArgs;
        this.async = async;
        allCommands.push(this);
    }
    /**
     * @param {string[]} args
     * @param {websocket} ws
     */
    run(args, ws) { }
};

const {createGame} = require('./commands/createGame');
const {fetchAllPlayedCards} = require('./commands/fetchAllPlayedCards');
const {fetchCards} = require('./commands/fetchCards');
const {fetchGames} = require('./commands/fetchGames');
const {join} = require('./commands/join');
const {logout} = require('./commands/logout');
const {loginWithSecret} = require('./commands/loginWithSecret');
const {pickCard} = require('./commands/pickCard');
const {playCard} = require('./commands/playCard');
const {setUsername} = require('./commands/setUsername');
const {start} = require('./commands/start');
const {fetchNames} = require('./commands/fetchNames');


exports.registerCommands = function() {
    /* eslint-disable */
    new createGame();
    new fetchGames();
    new setUsername();
    new logout();
    new join();
    new playCard();
    new start();
    new fetchCards();
    new pickCard();
    new fetchAllPlayedCards();
    new fetchNames();
    new loginWithSecret();
    /* eslint-enable */
};

exports.findCommand = function(commandname) {
    for (let i = 0; i !== allCommands.length; i++) {
        const command = allCommands[i];
        if (command.commandname === commandname) {
            return command;
        }
    }
};
