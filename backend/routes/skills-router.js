const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const skillsController = require('../controllers/skills-controller')
const checkAuth = require('../middleware/check-auth')

router.use(checkAuth)

router.post('/',
    [
        check('name')
            .not()
            .isEmpty(),
        check('goal')
            .not()
            .isEmpty(),
    ], skillsController.createSkill)

// router.get('/:sid', skillsController.getSkillById) // Bringing in Time Series data

router.patch('/:sid',
    [
        check('name')
            .not()
            .isEmpty(),
        check('goal')
            .not()
            .isEmpty(),
        check('sessionDuration')
            .not()
            .isEmpty()
    ], skillsController.updateSkill)

router.delete('/:sid', skillsController.deleteSkill)

router.get('/users/:uid', skillsController.getSkillsByUser)

module.exports = router