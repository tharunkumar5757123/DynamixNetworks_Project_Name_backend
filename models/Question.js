const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true // removes extra spaces
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} must have 2-5 options'] // optional validation
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Optional: Limit options array
function arrayLimit(val) {
  return val.length >= 2 && val.length <= 5;
}

module.exports = mongoose.model('Question', QuestionSchema);
