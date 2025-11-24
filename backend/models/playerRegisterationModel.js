const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const playerSchema = new mongoose.Schema({

    playerId:{type:Number,require:true},
    firstName:{type: String,require:true},
    lastName:{type: String,require:true},
   events :[{

    type:mongoose.Schema.Types.ObjectId,
    ref:'eventModel'
   }],
    graduaionYear:{type: Number,require:true},
    primaryPosition:{type:String,require:true},

    guardianEmail:{ type: String,
    required: true,
    unique: true, 
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
},

password:{
    type:String,require:true
},

});

 playerSchema.pre('save', async function(next) {
        if (!this.isModified('password')) {
            return next(); 
        }
        try {
            const salt = await bcrypt.genSalt(10); 
            this.password = await bcrypt.hash(this.password, salt); 
            next();
        } catch (error) {
            next(error);
        }
    });

     playerSchema.methods.comparePassword = async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

const playerModel = mongoose.model('Player',playerSchema);

module.exports = playerModel;