const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const AnswerSchema = new Schema({
  publishedDate: {
    type: Date,
    required: true
  }, 
  content: {
    type: String,
    required: true
  },
  author: {
    type: Number,
    required: true
  }
});

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = { Answer };