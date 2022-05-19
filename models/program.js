const mongoose = require('mongoose');

const programSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  // workouts: {type: mongoose.Schema.Types.ObjectId, ref: "Workout"},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User",  require: true }
});

module.exports = mongoose.model('Program', programSchema);
