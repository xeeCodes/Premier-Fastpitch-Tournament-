const mongoose = require('mongoose');

const coonectdb = async ()=> {

    try {

        const conn = await mongoose.connect(process.env.DB_URI);
        
        
    } catch (error) {
        
    }
}