const Quiz = require('../models/quiz')
const asyncWrapper = require('../routes/async')

const getAllQuizzes = asyncWrapper( async (req, res) => {
  const {title, license, subject, sort} = req.query
  const queryObject = {} 

  if (license) {
    queryObject.license = license
  }
  if (subject) {
    queryObject.subject = subject
  }
  if (title) {
    queryObject.title = { $regex: title, $options: 'i' }
  }

  let result = Quiz.find(queryObject)

  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result.sort('-createdAt')
  }

  const quizzes = await result


  res.status(200).json({quizzes, nbHits: quizzes.length})
})

const createQuiz = asyncWrapper(async (req, res) => {
  const quiz = await Quiz.create(req.body)
  res.status(200).json({quiz})
})

const getQuiz = asyncWrapper( async (req, res) => {
  const {id: quizID} = req.params;
  const quiz = await Quiz.findOne({_id: quizID})
  if (!quiz) {
    return res.status(404).json({msg:`No quiz with id: ${quizID}`})
  }
  res.status(200).json({quiz})
})

const updateQuiz = asyncWrapper( async (req, res) => {
  const {id: quizID} = req.params;
  const quiz = await Quiz.findOneAndUpdate({_id: quizID}, req.body, {
    new: true,
    runValidators: true
  })
  if (!quiz) {
    return res.status(404).json({msg:`No quiz with id: ${quizID}`})
  }
  res.status(200).json({quiz})
})

const deleteQuiz = asyncWrapper( async (req, res) => {
  
  const {id: quizID} = req.params;
  const quiz = await Quiz.findOneAndDelete({_id: quizID})
  if (!quiz) {
    return res.status(404).json({msg:`No quiz with id: ${quizID}`})
  }
  res.status(200).json({quiz})
})

module.exports = {
  getAllQuizzes,
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz
}