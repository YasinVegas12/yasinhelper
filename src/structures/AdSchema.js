const { Schema, model } = require("mongoose");

const schema = Schema({
    userID: String,
    userTAG: String,
    guildID: String,
    numberAD: String,
    text: String,
    status: String,
    editID: String,
    editTAG: String
});

module.exports = model("ad", schema);