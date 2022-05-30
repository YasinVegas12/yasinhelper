const { Schema, model } = require("mongoose");

const schema = Schema({
    userID: String,
    userTAG: String,
    guildID: String,
    text: String,
    staffID: String,
    staffTAG: String
});

module.exports = model("historys", schema);