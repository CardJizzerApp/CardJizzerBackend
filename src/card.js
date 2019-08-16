exports.Card = class {

    constructor(text, type) {
        this.text = text;
        this.type = type || "response";
        this.show = false;
    }

}
