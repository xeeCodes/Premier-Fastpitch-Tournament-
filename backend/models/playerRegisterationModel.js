const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const playerSchema = new mongoose.Schema({
    playerId: { type: Number, unique: true },
    firstName: { type: String, required: true },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'eventModel', default: [] }],
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: [] }],
    graduationYear: { type: Number, required: true },
    primaryPosition: { type: String, required: true },
    guardianEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { type: String, required: true }
});

playerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
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

playerSchema.plugin(AutoIncrement, { inc_field: 'playerId' });

const playerModel = mongoose.model('Player', playerSchema);
module.exports = playerModel;
