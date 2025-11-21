const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

    eventId:{type: Number,require:true,unique:true},
    name:{type: String,require:true},
    date:{type: Date,require:true},
    location:{type:String,require:true}
});

const eventModel = mongoose.model('Event',eventSchema);

module.exports = eventModel;