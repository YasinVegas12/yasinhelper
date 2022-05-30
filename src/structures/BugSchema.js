const { Schema, model } = require("mongoose");

const schema = Schema({
    bugnumber: 0,
    bugnumberall: { type: Number, default: 0 },
});

module.exports = model('Bugs', schema);