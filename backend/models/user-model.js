const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    totalSkills: { type: Number, require: true, default: 0 },
    totalTimeInvested: { type: Number, require: true, default: 0 },
    following: [{ type: mongoose.Types.ObjectId, required: true, default: [], ref: 'User' }],
    followers: [{ type: mongoose.Types.ObjectId, required: true, default: [], ref: 'User' }],
    skills: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Skill' }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
