const { Schema, model } = require("mongoose");

const schema = Schema({
    guildID: String,
    userID: String,
    status: String,
    numberTicket: String,
    channelID: String,
    tDelete: {
        type: Date
    }
});

module.exports = model("ticket", schema);