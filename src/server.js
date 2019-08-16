const ws = require("ws");
const {v4} = require("uuid");

const {findCommand, registerCommands} = require("./command");

const {ErrorCodeHelper, Responses} = require("./helper");
const ech = new ErrorCodeHelper();

const {Game} = require("./game");

const websocketServer = new ws.Server({port: 83});

registerCommands();

// new Game(0, ['ZR64P'], "false", 0, 0).start();

websocketServer.on("connection", ws => {
    ws.uuid = v4();
    ws.on("message", message => {

        const args = message.split(" ");
        const command = findCommand(args[0]);

        let response = ech.sendResponse(Responses.COMMAND_NOT_FOUND, null);        
        
        if (command !== undefined) {

            if ((args.length - 1) !== command.argsLength) {
                response = ech.sendResponse(Responses.INVALID_USAGE, null);
            } else {
                response = command.run(args.slice(1), ws);
            }

        }
        ws.send(response);
    })
});

exports.stopServer = function() {
    websocketServer.close();    
}
