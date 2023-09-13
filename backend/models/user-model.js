const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    totalTimeInvested: { type: Number, require: true, default: 0 },
    following: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
    followers: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
    skills: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Skill' }]
});

userSchema.virtual('skillCount').get(function () { return this.skills.length });
userSchema.virtual('followingCount').get(function () { return this.following.length });
userSchema.virtual('followerCount').get(function () { return this.followers.length });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
