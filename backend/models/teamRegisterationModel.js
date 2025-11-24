const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const teamSchema = new mongoose.Schema({

    teamName:{type: String,require:true},
    coachName:{type: String,require:true},
 events :[{

    type:mongoose.Schema.Types.ObjectId,
    ref:'eventModel'
   }],
    ageGroup:{type: String,require:true},
    state:{type:String,require:true},

    coachEmail:{ type: String,
    required: true,
    unique: true, 
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
},
password:{
    type:String,
    require:true,
}


});

// hash the password

teamSchema.pre('save',async function(next){

    if (!this.isModified('password')) {
            return next(); 
        }
        try {

            const salt = await bcrypt.genSalt(10);
             this.password = await bcrypt.hash(this.password,salt);
             next();
            
        } catch (error) {
            next(error);
            
        }
});

// now match the password

teamSchema.methods.comparePassword = async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };


const teamModel = mongoose.model('Team',teamSchema);

module.exports = teamModel;