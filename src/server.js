const https = require('https');
const ws = require('ws');
const {v4} = require('uuid');
const fs = require('fs');
const Sentry = require('@sentry/node');

const {findCommand, registerCommands} = require('./command');
let {allUsers, removeItem} = require('./player');

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

