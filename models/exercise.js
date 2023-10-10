const mongoose = require('mongoose');

const exercise = mongoose.Schema({
  name: {type: String},
  description: {type: String},
  comments: {type: String},
});

module.exports = mongoose.model('Exercise', exercise);