const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model')
const HttpError = require('../models/http-error')
const mongoose = require('mongoose')

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password').populate('skills');
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true, virtuals: true })) });
};

const getUserById = async (req, res, next) => {
    const userId = req.params.uid
    let user
    try {
        user = await User.findById(userId, '-password').populate('skills')
    } catch (err) {
        return next(new HttpError("Could not fetch user details, try again later", 500))
    }

    if (!user) {
        return next(new HttpError("Could not find a user with that ID", 404))
    }

    res.json({ user: user.toObject({ virtuals: true, getters: true }) })
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,

    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    res
        .status(201)
        .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {

    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.log("findone", err)
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        );
        console.log("user exists", existingUser)
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        console.log("Pass", err)
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        );
        console.log("invalid pass", existingUser, isValidPassword)
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1hr' }
        );
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        console.log("invalid token", err)
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    });
};

const deleteUser = async (req, res, next) => {
    // const userId = req.params.uid
    // if (userId !== req.userData.userId) {
    //     return next(new HttpError("You are not allowed to delete this user", 403))
    // }
    // let user
    // try {
    //     user = await User.findById(userId).populate('skills')
    // } catch (err) {
    //     return next(new HttpError("Deleting user failed, try again later", 500))
    // }

    // try {
    //     const sess = await mongoose.startSession()
    //     sess.startTransaction()
    //     await user.skills.deleteMany({ session: sess })
    //     await user.following
    // }
}

const followUser = async (req, res, next) => {
    const idToBeFollowed = req.params.uid

    if (idToBeFollowed === req.userData.userId) {
        return next(new HttpError("Being you're own friend is good for your mental health, but not for my app", 418))
    }

    let userToBeFollowed
    let userThatFollows
    try {
        userToBeFollowed = await User.findById(idToBeFollowed)
        userThatFollows = await User.findById(req.userData.userId)
    } catch (err) {
        console.log("finding error", err)
        return next(new HttpError("Could not follow user, try again later", 500))
    }
    if (!userToBeFollowed) {
        return next(new HttpError("No user was found with the given ID", 404))
    }
    if (userThatFollows.following.includes(idToBeFollowed)) {
        return next(new HttpError("You are already following this user", 404))
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        userToBeFollowed.followers.push(userThatFollows)
        userThatFollows.following.push(userToBeFollowed)
        await userToBeFollowed.save({ session: sess })
        await userThatFollows.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        return next(new HttpError("Could not follow user, try again later", 500))
    }
    res.json({ message: "Followed successfully" })
}

const unfollowUser = async (req, res, next) => {
    const idToUnfollow = req.params.uid

    if (idToUnfollow === req.userData.userId) {
        return next(new HttpError("You need to have your own back in life, but not on this app", 418))
    }

    let userToUnfollow
    let userThatUnfollows
    try {
        userToUnfollow = await User.findById(idToUnfollow)
        userThatUnfollows = await User.findById(req.userData.userId)
    } catch (err) {
        return next(new HttpError("Could not follow user, try again later", 500))
    }
    if (!userToUnfollow) {
        return next(new HttpError("No user was found with the given ID", 404))
    }
    if (!userThatUnfollows.following.includes(idToUnfollow)) {
        return next(new HttpError("You have already unfollowed this user", 404))
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        userToUnfollow.followers.pull(userThatUnfollows)
        userThatUnfollows.following.pull(userToUnfollow)
        await userToUnfollow.save({ session: sess })
        await userThatUnfollows.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        return next(new HttpError("Could not follow user, try again later", 500))
    }
    res.json({ message: "Unfollowed successfully" })
}

const getGlobalLeaderBoard = async (req, res, next) => {
    let users
    try {
        users = await User.find({}, '-password').sort({ totalTimeInvested: -1 }).limit(10)
    } catch (err) {
        return next(new HttpError("Could not fetch the leaderboards", 500))
    }
    res.json({
        users: users
            .map(user => user.toObject({ getters: true, virtuals: true }))
            .map(user => ({ id: user.id, name: user.name, skillCount: user.skillCount, totalTimeInvested: user.totalTimeInvested }))
    });
}

const getLocalLeaderboard = async (req, res, next) => {
    const userId = req.userData.userId
    let user
    try {
        user = await User.findById(userId).populate('following')
    } catch (err) {
        return next(new HttpError("Could not fetch the local leaderboards", 500))
    }
    if (!user) {
        return next(new HttpError("User not found", 500))
    }
    const localLeaderboard = [user]

    if (user.following && user.following.length > 0) {
        localLeaderboard.push(...user.following);
    }
    localLeaderboard.sort((first, second) => {
        if (first.totalTimeInvested > second.totalTimeInvested) return -1
        if (first.totalTimeInvested < second.totalTimeInvested) return 1
        return 1
    })
    const users = localLeaderboard
        .map(user => user.toObject({ getters: true, virtuals: true }))
        .map(user => ({ id: user.id, name: user.name, skillCount: user.skillCount, totalTimeInvested: user.totalTimeInvested }))
        .filter((_, idx) => idx < 10)

    res.json({ users: users })
}

exports.signup = signup;
exports.login = login;
exports.getUsers = getUsers
exports.getUserById = getUserById
exports.followUser = followUser
exports.unfollowUser = unfollowUser
exports.getGlobalLeaderBoard = getGlobalLeaderBoard
exports.getLocalLeaderboard = getLocalLeaderboard