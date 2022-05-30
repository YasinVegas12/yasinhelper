const { Schema, model } = require("mongoose");

const schema = Schema({
    userID: String,
    guildID: String,
    type: String,
    primeEnd: Number,
    status: String,
    pEnd: {
        type: Date
    }
});

module.exports = model('Prime', schema);