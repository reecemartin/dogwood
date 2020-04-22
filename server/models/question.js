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
  teacherAnswer: {
    type: ObjectId
  },
  studentAnswer: {
    type: ObjectId
  },
  comments: {
    type: [ObjectId]
  },
  hidden: {
    type: Boolean,
    required: true
  },
  anonymous: {
    type: Boolean,
    required: true
  }
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = { Question };