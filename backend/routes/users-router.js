const express = require('express')
const { check } = require('express-validator');
const router = express.Router()
const userController = require('../controllers/users-controller')
const checkAuth = require('../middleware/check-auth')

router.get('/', userController.getUsers)
router.get('/:uid', userController.getUserById)

router.post(
  '/signup',
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  userController.signup
);

router.post('/login', userController.login);

router.use(checkAuth)

router.post('/:uid/follow', userController.followUser)
router.delete('/:uid/unfollow', userController.unfollowUser)
router.get('/leaderboards/global', userController.getGlobalLeaderBoard)
router.get('/leaderboards/local', userController.getLocalLeaderboard)

module.exports = router