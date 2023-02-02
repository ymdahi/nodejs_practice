const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Must provide title'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  question: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Quiz', QuizSchema);