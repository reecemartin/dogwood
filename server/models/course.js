const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CourseSchema = new Schema({
  students: {
    type: [Number],
    required: true
  },
  teachers: {
    type: [Number],
    required: true
  },
  assignments: {
    type: [Number],
    required: true
  },
  courseId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 1
  }
});

CourseSchema.statics.findByCourseId = function(courseId) {
  console.log("findByCourseId");
  
  const Course = this

  return Course.findOne({ courseId: courseId }).then((course) => {
      if (!course) {
        console.log("reject");
          return Promise.reject()
      }
      console.log("resolved")
      return Promise.resolve(course)
  })
}


const Course = mongoose.model("Course", CourseSchema);

module.exports = { Course };