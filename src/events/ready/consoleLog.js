require("colors");
const mongoose = require('../../lib/mongoose');

module.exports = async (client) => {
    console.log(`[INFO] ${client.user.username} is online!`.bgCyan);
    await mongoose().catch((err) => console.log(`[ERROR] Connection to MongoDB error: \n${err}`.bgRed));
}