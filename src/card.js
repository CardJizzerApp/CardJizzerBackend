const {v4} = require('uuid');

module.exports.Card = class {
    /**
     * @param {string} text
     * @param {string} type
     */
    constructor(text, type) {
        this.uuid = v4();
        this.text = text;
        this.type = type || 'response';
        this.show = false;
    }
};
