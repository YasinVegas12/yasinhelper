const { Schema, model } = require("mongoose");

const schema = Schema({
    code: Number,
    time: String,
    status: String,
    type: String,
    userTAG: { type: String, default: "-" },
    userID: { type: String, default: "-" },
    guildID: { type: String, default: "-" }
});

module.exports = model('Prime-codes', schema)