const phaseState = {
    PlayCards: {name: 'playCards', id: 1},
    SelectCard: {name: 'selectCard', id: 2},
};
module.exports.phaseState = phaseState;

module.exports.Round = class {
    /**
     * @param {Player} cardJizzer
     * @param {Card} blackCard
     * @param {number} playerAmount
     */
    constructor(cardJizzer, blackCard, playerAmount) {
        this.allCards = {};
        this.playerAmount = playerAmount;
        this.cardJizzer = cardJizzer;
        this.blackCard = blackCard;
        this.cardsAmount = (blackCard.text.match(/{w}/g) || []).length;
        this.phase = phaseState.PlayCards;
        this.picked = {};
    }

    /**
     * Sets the status of all cards to shown
     */
    flipAllCards() {
        for (let i = 0; i !== this.allCards; i++) {
            const card = this.allCards;
            card.show = true;
        }
    }

    /**
     * @param {Player} player
     * @param {Card} card
     * @return {boolean} succeed
     */
    playCard(player, card) {
        const playerUUID = player.uuid;
        if (this.cardJizzer.uuid === playerUUID) return false;
        if (this.allCards[playerUUID] === undefined) {
            this.allCards[playerUUID] = [];
        }
        if (this.allCards[playerUUID].length >= this.cardsAmount) return false;
        this.allCards[playerUUID].push(card);
        if (this.hasEverybodyPicked()) {
            this.phase = phaseState.SelectCard;
        }
        return true;
    }

    /**
     *
     * @param {Player} player
     * @return {boolean}
     */
    hasAlreadyPicked(player) {
        return this.picked[player.uuid] !== undefined &&
            this.picked[player.uuid].length >= this.cardsAmount;
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

    /**
     * @return {boolean} everbody picked
     */
    hasEverybodyPicked() {
        const shouldPicks = this.cardsAmount * (this.playerAmount - 1);
        let picks = 0;
        for (let i = 0; i !== Object.keys(this.allCards).length; i++) {
            const playerPicks = this.allCards[
                Object.keys(this.allCards)[i]].length;
            picks += playerPicks;
        }
        return picks === shouldPicks;
    }
};
