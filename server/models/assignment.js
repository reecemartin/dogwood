const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const AssignmentSchema = new Schema({
  dueDate: Date,
  publishedDate: Date,
  creator: {
    type: Number,
    required: true
  },
  moderators: {
    type: [Number],
    required: true
  },
  students: {
    type: [Number],
    required: true
  },
  generalQuestions: {
    type: [ObjectId],
    required: true
  }, 
  questions: {
    type: [[ObjectId]], // lists of questions at each anchor
    required: true
  },
  questionAnchors: {
    type: [String],
    required: true
  },
  assignmentId: {
    type: Number,
    required: true,
    unique: true
  },
  courseId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 1
  }
}); 

AssignmentSchema.statics.findByAssignmentId = function(id) {
  console.log("findByAssignmentId");
  
  const Assignment = this;

  return Assignment.findOne({ assignmentId: id }).then((assignment) => {
    if (!assignment) {
      console.log("reject")
      return Promise.reject();
    }
    console.log("resolved")
    return Promise.resolve(assignment);
  })
}

const Assignment = mongoose.model('Assignmennt', AssignmentSchema);

module.exports = { Assignment };