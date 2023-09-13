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

// router.get('/:sid', skillsController.getSkillById)

// router.patch('/:sid', skillsController.updateSkill)

// router.delete('/:sid', skillsController.deleteSkill)

router.get('/users/:uid', skillsController.getSkillsByUser)

module.exports = router