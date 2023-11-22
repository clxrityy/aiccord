const { model, Schema } = require("mongoose");

let guildSchema = new Schema({
    GuildID: String,
    SystemRoleContent: String,
    Temperature: Number,
    ImageRoleContent: String,
}, { strict: false });

module.exports = model("guild", guildSchema);