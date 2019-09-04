const https = require('https');
const ws = require('ws');
const {v4} = require('uuid');
const fs = require('fs');
const Sentry = require('@sentry/node');

let {allUsers} = require('./userUtils');
const {removeItem} = require('./player');

const {findCommand, registerCommands} = require('./command');

const {ErrorCodeHelper, Responses} = require('./helper');
const ech = new ErrorCodeHelper();

const PORT = process.env.WS_PORT || 443;
const sslServer = https.createServer({
    key: fs.readFileSync(__dirname + '/ssl/priv.pem', 'utf-8'),
    cert: fs.readFileSync(__dirname + '/ssl/fullchain.pem', 'utf-8'),
});
const websocketServer = new ws.Server({port: PORT, server: sslServer});

Sentry.init({dsn: 'https://a99b8a0f5e4f4e0cbb10d81e45aabc2a@sentry.io/1541060'});

registerCommands();

websocketServer.on('connection', (ws) => {
    ws.uuid = v4();
    ws.secretCode = v4();
    ws.on('message', (message) => {
        const commandId = message.split(';').length > 1 ?
            message.split(';')[0] + ';'
            : '';
        let request = undefined;
        try {
            request = commandId == ''?
                JSON.parse(message):
                JSON.parse(message.split([1]));
        } catch (Error) {
            return ws.send(ech.sendResponse(Responses.INVALID_JSON, null));
        }
        const commandName = request.command;
        const command = findCommand(commandName);

        if (command !== undefined) {
            // if ((args.length - 1) !== command.argsLength) {
            //     return ws.send(commandId +
            //         ech.sendResponse(Responses.INVALID_USAGE, null));
            // } else {
            //     if (command.async === undefined || command.async === false) {
            //         return ws.send(commandId +
            //             command.run(args.slice(1), ws));
            //     } else {
            //         return command.run(args.slice(1), ws).then((response) =>{
            //             return ws.send(commandId + response);
            //         });
            //     }
            // }
            let args = request.params;
            if (args === undefined) {
                args = {};
            }
            const argsKeys = Object.keys(args);
            const requiredArgs = command.requiredArgs;
            for (let i = 0; i !== requiredArgs.length; i++) {
                if (argsKeys.indexOf(requiredArgs[i]) !== -1) continue;
                return ws.send(commandId +
                    ech.sendResponse(Responses.INVALID_USAGE, null));
            }
            if (command.async === undefined || command.async === false) {
                return ws.send(commandId +
                    command.run(args, ws));
            } else {
                return command.run(args, ws).then((response) => {
                    return ws.send(commandId + response);
                });
            }
        }
        return ws.send(ech.sendResponse(Responses.COMMAND_NOT_FOUND, null));
    });
    ws.on('close', () => {
        for (let i = 0; i !== allUsers.length; i++) {
            const player = allUsers[i];
            if (player.uuid === ws.uuid) {
                allUsers = removeItem(allUsers, i);
                return;
            }
        };
    });
});

module.exports.stopServer = function() {
    websocketServer.close();
};
module.exports.port = PORT;
