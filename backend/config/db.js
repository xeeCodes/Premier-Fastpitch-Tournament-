const mongoose = require('mongoose');

const coonectdb = async ()=> {

    try {

        const conn = await mongoose.connect(process.env.DB_URI ,{

            useUnifiedTopology: true,
            useNewUrlParsrer: true,
            useCreateIndex: true,
        });
console.log(`MongoDb connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
    }
}
module.exports = coonectdb;