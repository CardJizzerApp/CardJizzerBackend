const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        required: true,
        type: String,
    },
    token: {
        required: false,
        type: String,
    },
    username: {
        required: true,
        type: String,
    },
});

module.exports = mongoose.model('User', UserSchema);
