const { Schema, model } = require("mongoose");

const schema = Schema({
    userID: String,
    badges: String
});

module.exports = model("badge", schema);