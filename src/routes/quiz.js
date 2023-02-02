const express = require('express')
const router = express.Router()

const { getAllQuizzes, createQuiz, getQuiz, updateQuiz, deleteQuiz,} = require('../controllers/quiz')

router.route('/')
  .get(getAllQuizzes)
  .post(createQuiz)

router.route('/:id')
  .get(getQuiz)
  .patch(updateQuiz)
  .delete(deleteQuiz)

module.exports = router