exports.Round = class {
    
    constructor(cardJizzer, blackCard) {
        this.allCards = {};
        this.cardJizzer = cardJizzer;
        this.blackCard = blackCard;
    }

    flipAllCards() {
        for (let i = 0; i!== this.allCards; i++) {
            const card = this.allCards;
            card.show = true;
        }
    }

}
