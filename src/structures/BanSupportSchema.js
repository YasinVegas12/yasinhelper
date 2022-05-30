const { Schema, model } = require("mongoose");

const reqString = {
    type: String,
    required: true,
}

const schema = Schema({
    userID: reqString,
    guildID: reqString,
    reason: reqString,
    staffID: reqString,
    expires: {
      type: Date,
      required: true,
    },
    current: {
      type: Boolean,
      required: true,
    }
});

module.exports = model("banSupport", schema);