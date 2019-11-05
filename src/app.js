const environment = require('./environment').getEnvironment();

// Databases
const redis = require('redis');
const mongoClient = require('mongodb').MongoClient;

const http = require('http');
const Ws = require('ws');
const {v4} = require('uuid');
const Sentry = require('@sentry/node');

let {allUsers} = require('./userUtils');
const {removeItem} = require('./player');

const {findCommand, registerCommands} = require('./command');

const {Responses} = require('./helper');

const {Dependencies} = require('./dependencyHandler');

exports.App = class App {
    /**
     * Initial setup for server
     */
    constructor() {
        this.server = http.createServer();
        this.websocketServer = new Ws.Server({
            port: environment.PORT,
            server: this.server,
        });
        if (environment.TYPE === 'prod' ) {
            console.log('[*] Server started');
            Sentry.init({dsn: environment.SENTRY_DSN});
        }
    }

    /**
     * Establish a connection to the mongo database
     */
    async connectMongo() {
        const url = `mongodb://${environment.MONGO_HOST}`
            + `:${environment.MONGO_PORT}/${environment.MONGO_DATABASE}`;
        await mongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, (err) => {
            if (err !== null) {
                return console.error(
                    '[!] Mongo connection could not be established.');
            }
            console.log('[*] Mongo connection established.');
        });
    }

    /**
     * Establish a connection to the redis database
     * @return {Promise}
     */
    connectRedis() {
        return new Promise((resolve, reject) => {
            const client = redis.createClient({
                host: environment.REDIS_HOST,
                port: environment.REDIS_PORT,
            });
            client.on('connect', () => {
                console.log('[*] Redis connection established.');
                resolve(true);
            });
            client.on('error', () => {
                reject(
                    new Error('[!] Redis connection could not be established!'),
                );
            });
            this.redisClient = client;
        });
    }
    /**
     * Declares websocket handlers
     */
    defineWebSocketHandler() {
        this.websocketServer.on('connection', (ws) => {
            ws.uuid = v4();
            ws.secretCode = v4();
            ws.on('message', (message) => {
                this.parseRequest(message, ws).then((response) => {
                    ws.send(response);
                });
            });
            ws.on('close', () => {
                let i = 0;
                allUsers.forEach((player) => {
                    if (player.uuid = ws.uuid) {
                        allUsers = removeItem(allUsers, i);
                        i += 1;
                        return;
                    }
                });
            });
        });
    }

    /**
     * Starts the server
     * @return {Promise}
     */
    start() {
        return new Promise(async (resolve) => {
            this.connectRedis().then(async () => {
                await this.connectMongo();
                registerCommands(this);
                Dependencies['redis'] = this.redisClient;
                this.defineWebSocketHandler();
                resolve();
            });
        });
    }
    /**
     * @param {string} commandParams
     * @param {any} requiredArgs
     * @return {any}
     */
    getCommand(commandParams) {
        try {
            const commandObject = JSON.parse(commandParams);
            const command = findCommand(commandObject.command);
            if (command === undefined) {
                return Responses.COMMAND_NOT_FOUND;
            }
            const requiredArgs = command.requiredArgs;
            const params = commandObject.params === undefined ?
                {} :
                commandObject.params;
            const paramKeys = Object.keys(params);
            for (let i = 0; i !== requiredArgs.length; i++) {
                if (paramKeys.indexOf(requiredArgs[i]) !== -1) continue;
                return undefined;
            }
            return command;
        } catch (Error) {
            return undefined;
        }
    }
    /**
     * @param {string} message
     * @param {Websocket} ws
     * @return {any}
     */
    async parseRequest(message, ws) {
        const requestParts = message.split(';');
        if (requestParts.length > 2) {
            return Responses.INVALID_JSON;
        }
        const commandParams = requestParts.length === 1 ?
            requestParts[0] :
            requestParts[1];
        const commandId = requestParts.length === 2 ?
            requestParts[0] + ';' :
            '';
        const command = this.getCommand(commandParams);
        if (command === undefined) {
            return commandId + Responses.INVALID_USAGE;
        }
        const commandObject = JSON.parse(commandParams);
        if (command.async === undefined || !command.async) {
            const response = command.run(commandObject.params, ws);
            return commandId + response;
        }
        const response = await command.run(commandObject.params, ws);
        return commandId + response;
    }
    /**
     * Stops the server
     */
    stop() {
        console.log('[*] Stopping server');
        this.websocketServer.close();
    };
    /**
     * Port the server is running on.
     */
    get Port() {
        return environment.PORT;
    };
};
