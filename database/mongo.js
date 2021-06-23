const mongoose = require("mongoose");
const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;

const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
};
// Make connection to MongoDB
const connectToMongoDB = async () => {
    try {
        const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

        mongoose.connect(url, options).then( function() {
            console.log('MongoDB is connected');
        }) .catch( function(err) {
            console.log(err);
        });

        console.log("Connected to MongoDB...");
    } catch (err) {
        console.error(err.message);
        // Terminate the application
        process.exit(1);
    }
};

module.exports = connectToMongoDB;