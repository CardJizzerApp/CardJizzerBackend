const environment = require('./environment').getEnvironment();
// Databases
const redis = require('redis');
const mongoClient = require('mongodb').MongoClient;
const http = require('http');
const Ws = require('ws');
const {v4} = require('uuid');
const Sentry = require('@sentry/node');

const {Dependencies} = require('./dependencyHandler');
const {findCommand, registerCommands} = require('./command');
const {Responses, ErrorCodeHelper} = require('./helper');

const ech = new ErrorCodeHelper();

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
     * Establishes a connection to the mongo database
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
     * Establishes a connection to the redis database
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
     * Defines actions that run after the websockt receives a message
     */
    defineWebSocketHandler() {
        this.websocketServer.on('connection', (ws) => {
            ws.uuid = v4();
            ws.on('message', (message) => {
                this.parseRequest(message, ws).then((response) => {
                    ws.send(response);
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
     * @param {string} commandObject
     * @param {any} requiredArgs
     * @return {any}
     */
    parseCommandObject(commandObject) {
        const command = findCommand(commandObject.command);
        if (command === undefined) {
            return undefined;
        }
        const requiredArgs = command.requiredArgs;
        const params = commandObject.params === undefined ?
            {} : commandObject.params;
        let valid = true;
        requiredArgs.forEach((arg) => {
            if (Object.keys(params).find((c) => c === arg) === undefined) {
                valid = false;
            }
        });
        return valid ? command : undefined;
    }
    /**
     * @param {string} message
     * @param {Websocket} ws
     * @return {any}
     */
    parseRequest(message, ws) {
        return new Promise(async (resolve) => {
            let requestObject = undefined;
            try {
                requestObject = JSON.parse(message);
            } catch (Error) {
                return resolve(ech.sendResponse(Responses.INVALID_JSON));
            }
            const command = this.parseCommandObject(requestObject);
            if (command === undefined) {
                return resolve(ech.sendResponse(Responses.COMMAND_NOT_FOUND));
            }
            if (command.async === undefined || !command.async) {
                const response = command.run(requestObject.params, ws);
                resolve(response);
            }
            const response = await command.run(requestObject.params, ws);
            resolve(response);
        });
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
