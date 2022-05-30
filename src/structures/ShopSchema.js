const { Schema, model } = require("mongoose");

const schema = Schema({
    roleName: String,
    roleID: String,
    price: String,
    description: String,
    guildID: String
});

module.exports = model("shops", schema);