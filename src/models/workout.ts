import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  date: { type: Date },
  comment: { type: String },
});

const workoutItemSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  // comments: [commentSchema],
  comments: { type: String },
  clientComments: [commentSchema],
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: false, // Optional if the exercise is typed in
  },
  customExercise: {
    type: String, // For custom exercises typed in by the user
    required: false,
  },
  sets: {
    type: Number,
    required: false,
  },
  reps: {
    type: Number,
    required: false,
  },
  weight: {
    type: Number, // Optional, depending on the type of exercise
  },
  time: {
    type: Number, // Optional, for timed exercises
  },
  result: {
    type: String, // This can store either 'time' or 'reps' based on the exercise
    required: false,
  },
  type: {
    type: String,
  },
  scoreType: {
    type: String,
  },
});

const workoutSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  updatedAt: {
    type: Date,
  },
  name: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
  },
  personalWorkout: { type: Boolean },
  favorite: { type: Boolean },
  workoutItems: [workoutItemSchema],
});

const WorkoutSchema = mongoose.model('Workout', workoutSchema);
export default WorkoutSchema;
