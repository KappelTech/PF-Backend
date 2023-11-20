const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  date: { type: Date, },
  comment: { type: String },
});

const workoutItemSchema = mongoose.Schema({
  name: { type: String, },
  description: { type: String, },
  // comments: [commentSchema],
  comments: {type: String},
  clientComments: [commentSchema]
});


const workoutSchema = mongoose.Schema({
  date: { type: Date },
  name: { type: String, },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
  },
  personalWorkout: { type: Boolean },
  favorite: {type: Boolean},
  workoutItems: [workoutItemSchema],
 


});

module.exports = mongoose.model('Workout', workoutSchema);
