const {CardJizzerPickedEvent} = require("./eventhandler");

const phaseState = {
    PlayCards: {name: "playCards", id: 1},
    SelectCard: {name: "selectCard", id: 2},
};
module.exports.phaseState = phaseState;

module.exports.Round = class {
    
    constructor(cardJizzer, blackCard, playerAmount) {
        this.allCards = {};
        this.playerAmount = playerAmount;
        this.cardJizzer = cardJizzer;
        this.blackCard = blackCard;
        this.cardsAmount = (blackCard.text.match(/{w}/g) || []).length;
        this.phase = phaseState.PlayCards;
        this.picked = {};
    }

    flipAllCards() {
        for (let i = 0; i!== this.allCards; i++) {
            const card = this.allCards;
            card.show = true;
        }
    }

    playCard(player, card) {
        const playerUUID = player.uuid;
        if (this.cardJizzer.uuid === playerUUID) return false;
        if (this.allCards[playerUUID] === undefined) this.allCards[playerUUID] = [];
        if (this.allCards[playerUUID].length >= this.cardsAmount) return false;
        this.allCards[playerUUID].push(card);
        if (this.hasEverybodyPicked()) {
            this.phase = phaseState.SelectCard;
            new CardJizzerPickedEvent().trigger(this.cardJizzer);
        }
        return true;
    }

    /**
     * 
     * @param {Player} player
     * @return {boolean} 
     */
    hasAlreadyPicked(player) {
        return this.picked[player.uuid] !== undefined && this.picked[player.uuid].length >= this.cardsAmount;
    }

    /**
     * @param {Player} player
     * @return {Card[]}
     */
    getPicks(player) {
        if (!this.hasAlreadyPicked(player)) {
            return undefined;
        }
        return this.picked[player.uuid];
    }

    hasEverybodyPicked() {
        const shouldPicks = this.cardsAmount * (this.playerAmount - 1);
        let picks = 0;
        for (let i = 0; i !== Object.keys(this.allCards).length; i++) {
            const amountPlayer = this.allCards[Object.keys(this.allCards)[i]].length;
            picks += amountPlayer;
        }
        return picks === shouldPicks;
    }

}
