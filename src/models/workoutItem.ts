import mongoose from 'mongoose';

const workoutItemSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  comments: { type: String },
  // workout: {type: mongoose.Schema.Types.ObjectId, ref: "Workout"}
  // creator: {type: mongoose.Schema.Types.ObjectId, ref: "User",  require: true }
});

const WorkoutItemSchema = mongoose.model('WorkoutItem', workoutItemSchema);

export default WorkoutItemSchema;
