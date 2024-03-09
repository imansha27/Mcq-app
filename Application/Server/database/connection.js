const mongoose = require('mongoose');

require('dotenv').config(); 

const DB_URL = process.env.DB_URL;

module.exports = async function connectToDatabase() {
    try {
        await mongoose.connect(DB_URL);
        console.log('DB connected');
    } catch (err) {
        console.error('DB connection error', err);
    }
};
