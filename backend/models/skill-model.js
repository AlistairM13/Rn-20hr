const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const skillSchema = new Schema({
    name: { type: String, required: true, unique: true },
    goal: { type: String, required: true },
    timeInvested: { type: Number, required: true, default: 0 },
    createdBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

skillSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Skill', skillSchema);
