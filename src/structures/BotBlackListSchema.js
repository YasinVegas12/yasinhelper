const { Schema, model } = require("mongoose");

const schema = Schema({
    userID: String,
    banBUG: Boolean,
    fullBAN: Boolean,
    reason: String
});

module.exports = model("Bans", schema);