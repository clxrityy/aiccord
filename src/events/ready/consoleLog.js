require("colors");

module.exports = (client) => {
    console.log(`[INFO] ${client.user.username} is online!`.bgGreen);
}