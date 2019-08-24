const https = require('https');
const ws = require('ws');
const {v4} = require('uuid');
const fs = require('fs');

const {findCommand, registerCommands} = require('./command');

const {ErrorCodeHelper, Responses} = require('./helper');
const ech = new ErrorCodeHelper();

const PORT = process.env.WS_PORT || 443;
console.log(PORT);
const sslServer = https.createServer({key: fs.readFileSync(__dirname + '/ssl/priv.pem', 'utf-8'), cert: fs.readFileSync(__dirname + '/ssl/fullchain.pem', 'utf-8')})
const websocketServer = new ws.Server({port: PORT, server: sslServer});

registerCommands();

// new Game(0, ['ZR64P'], "false", 0, 0).start();

websocketServer.on('connection', (ws) => {
    ws.uuid = v4();
    ws.on('message', (message) => {
        const commandId = message.split(';').length > 1 ?
            message.split(';')[0] + ';'
            : '';
        const args = message.split(' ');
        const commandName = commandId === '' ? args[0] : args[0].split(';')[1];
        const command = findCommand(commandName);

        if (command !== undefined) {
            if ((args.length - 1) !== command.argsLength) {
                return ws.send(commandId +
                    ech.sendResponse(Responses.INVALID_USAGE, null));
            } else {
                if (command.async === undefined || command.async === false) {
                    return ws.send(commandId +
                        command.run(args.slice(1), ws));
                } else {
                    return command.run(args.slice(1), ws).then((response) => {
                        return ws.send(commandId + response);
                    });
                }
            }
        }
        return ws.send(ech.sendResponse(Responses.COMMAND_NOT_FOUND, null));
    });
});

module.exports.stopServer = function() {
    websocketServer.close();
};
module.exports.port = PORT;

