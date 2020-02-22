const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const QuestionSchema = new Schema({
  publishedDate: {
    type: Date,
    required: true
  },
  author: {
    type: Number,
    required: true
  },
  upvotes: {
    type: Number,
    required: true
  },
  downvotes: {
    type: Number,
    required: true
  }, 
  content: {
    type: String,
    required: true
  }, 
  answer: {
    type: ObjectId
  },
  comments: {
    type: [ObjectId]
  }
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = { Question };