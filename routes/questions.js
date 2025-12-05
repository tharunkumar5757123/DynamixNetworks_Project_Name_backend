const express = require('express')
const router = express.Router()
const controller = require('../controllers/questionsController')


router.get('/', controller.getQuestions)
router.post('/', controller.addQuestion)


module.exports = router