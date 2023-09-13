const mongoose = require('mongoose')
const Skill = require('../models/skill-model')
const User = require('../models/user-model')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator');

const createSkill = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, goal } = req.body

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Creating skill failed, please try again user not found',
            500
        );
        return next(error);
    }
    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    try {
        const existingName = await Skill.findOne({ name: name })
        if (existingName) {
            const error = new HttpError('Skill by the same name already exists', 400);
            return next(error);
        }
    } catch (err) {
        console.log("create skill finding existingname", err)
        const error = new HttpError(
            'Creating skill failed, please try again user not found',
            500
        );
        return next(error);
    }

    const createdSkill = new Skill({
        name: name,
        goal: goal,
        createdBy: req.userData.userId,
    })

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdSkill.save({ session: sess })
        user.skills.push(createdSkill)
        user.totalSkills += 1
        await user.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        console.log("create skill session", err)
        const error = new HttpError('Creating skill failed, please try again', 500);
        return next(error);
    }
    res.status(201).json({ skill: createdSkill })
}

const getSkillsByUser = async (req, res, next) => {
    const userId = req.params.uid

    let userWithSkills
    try {
        userWithSkills = await User.findById(userId).populate('skills')
    } catch (err) {
        console.log("getskills by user find", err)
        const error = new HttpError('Creating skill failed, please try again', 500);
        return next(error);
    }

    if (!userWithSkills) {
        const error = new HttpError('Could not find user with that ID', 404);
        return next(error);
    }

    res.json({
        skills: userWithSkills.skills.map(skill =>
            skill.toObject({ getter: true }))
    })
}

const updateSkill = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const skillId = req.params.sid
    const userId = req.userData.userId
    const updatedSkill = req.body


    let skill
    try {
        skill = await Skill.findById(skillId)
        const existingName = await Skill.findOne({ name: updatedSkill.name })
        if (existingName) {
            return next(new HttpError('Skill by the same name already exists', 400));
        }
    } catch (err) {
        console.log("update skill findbyid", err)
        const error = new HttpError('Updating skill failed please try again', 500);
        return next(error);
    }
    let user
    try {
        user = await User.findById(userId)
    } catch (err) {
        console.log("update skill find", err)
        const error = new HttpError('Updating skill failed please try again', 500);
        return next(error);
    }

    if (!user) {
        return next(new HttpError('No user was found with the given ID', 404));
    }
    if (!skill) {
        return next(new HttpError('No skill was found with the given ID', 404));
    }

    if (skill.createdBy.toString() !== userId) {
        return next(new HttpError('You are not allowed to update this skill', 403));
    }

    skill.name = updatedSkill.name ?? skill.name
    skill.goal = updatedSkill.goal ?? skill.goal
    skill.timeInvested += updatedSkill.timeThisSession ?? 0

    user.totalTimeInvested += updatedSkill.timeThisSession ?? 0

    try {
        await skill.save()
        await user.save()
    } catch (err) {
        console.log("update skill save", err)
        const error = new HttpError('Updating skill failed please try again', 500);
        return next(error);
    }

    res.json({ skill: skill.toObject({ getters: true }) })
}

const deleteSkill = async (req, res, next) => {
    const skillId = req.params.sid
    const userId = req.userData.userId

    let skill
    try {
        skill = await Skill.findById(skillId).populate('createdBy')
    } catch (err) {
        console.log("delete", err)
        return next(new HttpError('Deleting skill failed, try again later', 500));
    }
    if (!skill) return next(new HttpError('No skill was found with the given ID', 404));

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        return next(new HttpError('Deleting skill failed, try again later', 500));
    }
    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    if (skill.createdBy.id !== userId) return next(new HttpError('You are not allowed to delete this skill', 403));

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await Skill.deleteOne(skill, { session: sess })
        skill.createdBy.skills.pull(skill)
        user.totalSkills -= 1
        await user.save({ session: sess })
        await skill.createdBy.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        console.log("delete session", err)
        return next(new HttpError('Deleting skill failed, try again later', 500));
    }

    res.json({ message: "Skill deleted" })
}


exports.createSkill = createSkill
exports.getSkillsByUser = getSkillsByUser
exports.updateSkill = updateSkill
exports.deleteSkill = deleteSkill