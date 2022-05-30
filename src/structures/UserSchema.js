const { Schema, model } = require("mongoose");

const schema = Schema({
    guildID: String,
    userID: String,
    money: { type: Number, default: 0 },
    worms: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    holdticket: { type: Number, default: 0},
    one_rep: { type: Number, default: 0 },
    two_rep: { type: Number, default: 0 },
    three_rep: { type: Number, default: 0 },
    four_rep: { type: Number, default: 0 },
    five_rep: { type: Number, default: 0 },
    givekick: { type: Number, default: 0 },
    promo: { type: String, default: "не использовал"},
    givemute: { type: Number, default: 0 },
    givewarn: { type: Number, default: 0 },
    rubles: { type: Number, default: 0 },
    giveban: { type: Number, default: 0 },
    warn: { type: Number, default: 0 },
    job: { type: String, default: "безработный" },
    Job_skill: { type: Number, default: 0 },
    inventory: String,
    _time: { type: Number, default: 0 },
    _work_time: { type: Number, default: 0 }
});

module.exports = model("User", schema);