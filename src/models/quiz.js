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
  },
  license: {
    type: String,
    enum: {
      values: ['CC BY', 'CC BY-SA', 'CC BY-NC', 'CC BY-ND', 'CC BY-NC-SA', 'CC BY-NC-ND', 'CC0'],
      message: '{VALUE} is not supported'
    }
  },
  subject: {
    type: String,
    enum: {
      values: ['Biology', 'Business & Management', 'Chemistry', 'Engineering & Technology', 'Geosciences', 'Humanities', 'K-12'],
      message: '{VALUE} is not supported'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model('Quiz', QuizSchema);