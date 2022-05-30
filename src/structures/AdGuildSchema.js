const { Schema, model } = require("mongoose");

const schema = Schema({
    guildID: String,
    numberAD: String,
});

module.exports = model("adsSchema", schema);