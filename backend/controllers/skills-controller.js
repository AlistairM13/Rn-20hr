const mongoose = require('mongoose')
const Skill = require('../models/skill-model')
const User = require('../models/user-model')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator');

const createSkill = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
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
            const error = new HttpError(
                'Skill by the same name exists already',
                400
            );
            return next(error);
        }
    } catch (err) {
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
        await user.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
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


exports.createSkill = createSkill
exports.getSkillsByUser = getSkillsByUser