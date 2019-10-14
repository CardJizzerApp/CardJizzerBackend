const {Command} = require('../command');

const {ErrorCodeHelper, Responses} = require('../helper');

const {getPlayerByUUID} = require('../player');

const {RoundStoppedEvent} = require('../events/roundStoppedEvent');

const ech = new ErrorCodeHelper();

exports.pickCard = class extends Command {
    /**
     * Pickcard [cardUUID: string]
     */
    constructor() {
        super('pickcard', ['cardid'], false);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
        const cardUUID = args.cardid;
        return this.isInGame(ws, (game, player, err) => {
            if (game.round.cardJizzer.uuid !== player.uuid) {
                return ech.sendResponse(Responses.NOT_CARD_JIZZER, null);
            }
            return this.pickCard(game, cardUUID);
        });
    }
    /**
     * @param {Game} game
     * @param {string} cardUUID
     * @return {string}
     */
    pickCard(game, cardUUID) {
        try {
            const player = this.getPlayerOfCard(game, cardUUID);
            new RoundStoppedEvent().trigger(game,
                player);
            game.nextRound(player.uuid);
            return ech.sendResponse(Responses.OK, null);
        } catch (err) {
            return ech.sendResponse(Responses.CARD_COULD_NOT_BE_PICKED, null);
        }
    }
    /* eslint-disable valid-jsdoc */
    /**
     * Returns the player of a card.
     * @param {Game} game
     * @param {string} cardUUID
     * @return {string} playerUUID
     */
    getPlayerOfCard(game, cardUUID) {
        const keys = Object.keys(game.round.allCards);
        let player = undefined;
        keys.forEach((playerUUID) => {
            const cardsPlayedByPlayer = game.round.allCards[playerUUID];
            cardsPlayedByPlayer.forEach((card) => {
                if (card.uuid === cardUUID) {
                    player = getPlayerByUUID(playerUUID);
                }
            });
        });
        return player;
    }
};
