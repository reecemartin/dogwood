const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
    minlength: 1,
    unique: true
  }, 
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  coursesTeaching: {
    type: [Number]
  },
  coursesStudying: {
    type: [Number]
  }
});

UserSchema.statics.findByUserId = function(cId) {
  console.log("findByUserId");
  
  const User = this;

  return User.findOne({ userId: cId }).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return Promise.resolve(user);
  })
}

const User = mongoose.model('User', UserSchema);

module.exports = { User };