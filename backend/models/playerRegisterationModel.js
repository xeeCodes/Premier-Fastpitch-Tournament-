const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({

    firstName:{type: String,require:true},
    lastName:{type: String,require:true},

    graduaionYear:{type: Number,require:true},
    primaryPosition:{type:String,require:true},

    guardianEmail:{ type: String,
    required: true,
    unique: true, 
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
}

});

const playerModel = mongoose.model('Player',playerSchema);

module.exports = playerModel;