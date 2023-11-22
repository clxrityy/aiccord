require('colors');
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

module.exports = async () => {
    if (!mongoURI) {
        console.log(`[WARNING] Missing MongoURI environment variable!`.red);
        return;
    }
    mongoose.set("strictQuery", true);
    try {
        if (await mongoose.connect(mongoURI)) {
            console.log(`[INFO] Connected to the database!`.bgGreen);
        }
    } catch (error) {
        console.log(`[ERROR] Couldn't establish a MongoDB connection! \n${error}`.bgRed);
    }
}