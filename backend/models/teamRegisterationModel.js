const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({

    teamName:{type: String,require:true},
    coachName:{type: String,require:true},

    ageGroup:{type: String,require:true},
    state:{type:String,require:true},

    coachEmail:{ type: String,
    required: true,
    unique: true, 
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
}

});

const teamModel = mongoose.model('Team',teamSchema);

module.exports = teamModel;