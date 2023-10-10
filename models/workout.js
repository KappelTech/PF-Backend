const mongoose = require('mongoose');

const workoutItemSchema = mongoose.Schema({
  name: { type: String, },
  description: { type: String, },
  comments: { type: String },
  // workout: {type: mongoose.Schema.Types.ObjectId, ref: "Workout"}
  // creator: {type: mongoose.Schema.Types.ObjectId, ref: "User",  require: true }
});


const workoutSchema = mongoose.Schema({
  date: { type: Date },
  name: { type: String, },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // workoutItems: {type: mongoose.Schema.Types.ObjectId, ref: "WorkoutItem"},
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
  },
  personalWorkout: { type: Boolean },
  // workoutItems: {
  //   type:[{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "WorkoutItem"
  //   }]
  // },
  workoutItems: [workoutItemSchema]

  // workoutItems: [
  //   {
  //     name:  String ,
  //     description:  String ,
  //     comments: String ,
  //   }
  // ]
});

module.exports = mongoose.model('Workout', workoutSchema);
