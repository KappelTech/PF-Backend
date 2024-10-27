const mongoose = require('mongoose');

// const exercise = mongoose.Schema({
//   name: {type: String},
//   description: {type: String},
//   comments: {type: String},
// });

// module.exports = mongoose.model('Exercise', exercise);

// Define the schema for exercises
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  muscle: String,
  equipment: String,
  difficulty: String,
  instructions: String
  // Add any other fields that are in your collection
});

// Create the Exercise model
const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;