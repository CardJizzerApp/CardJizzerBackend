const ws = require("ws");
const {v4} = require("uuid");

const {findCommand, registerCommands} = require("./command");

const {ErrorCodeHelper, Responses} = require("./helper");
const ech = new ErrorCodeHelper();

const websocketServer = new ws.Server({port: 83});

require("./round");
require("./eventhandler");
require("./game");
require("./player");
require("./card");

registerCommands();

// new Game(0, ['ZR64P'], "false", 0, 0).start();

websocketServer.on("connection", ws => {
    ws.uuid = v4();
    ws.on("message", message => {

        const args = message.split(" ");
        const command = findCommand(args[0]);

        if (command !== undefined) {

            if ((args.length - 1) !== command.argsLength) {
                return ws.send(ech.sendResponse(Responses.INVALID_USAGE, null));
            } else {
                if (command.async === undefined || command.async === false) {
                    return ws.send(command.run(args.slice(1), ws));
                }
                else {
                    return command.run(args.slice(1), ws).then((response) => {
                        return ws.send(response);
                    });
                }
            }

        }
        return ws.send(ech.sendResponse(Responses.COMMAND_NOT_FOUND, null));

    })
});

module.exports.stopServer = function() {
    websocketServer.close();    
}
