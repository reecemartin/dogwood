const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommentSchema = new Schema({
  publishedDate: {
    type: Date,
    required: true
  },
  author: {
    type: ObjectId,
    required: true
  },
  content: {
    type: String,
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
  replies: {
    type: [ObjectId],
  }
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = { Comment };