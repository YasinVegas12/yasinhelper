const { Schema, model } = require("mongoose");

const schema = Schema({
    guildID: String,
    ownerpromoID: String,
    promocode: String,
    lvlpromo: Number,
    usepromo: { type: Number, default: 0 },
});

module.exports = model("promo", schema);