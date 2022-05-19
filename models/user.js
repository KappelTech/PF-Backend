const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = mongoose.Schema({
  firstName:{
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
    // select: false
  },
  role: {
    type: String,
    default: 'client',
    enum: ['client', 'admin']
  },
  active: {
    type: Boolean,
    default: false,
    require: true
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
