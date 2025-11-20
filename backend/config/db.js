const mongoose = require('mongoose');

const coonectdb = async ()=> {

    try {

        const conn = await mongoose.connect(process.env.DB_URI);
console.log(`MongoDb connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
        process.exit(1);
    }
}
module.exports = coonectdb;