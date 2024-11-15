import mongoose from 'mongoose';

const workoutResultsSchema = new mongoose.Schema({
  // client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // workout: { type: mongoose.Schema.Types.ObjectId, ref:"Workout"},
  // date: { type: Date, },
  comment: { type: String },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  workoutItemsResults: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: false, // Optional if custom exercise
      },
      customExercise: {
        type: String, // For custom exercises typed in by the user
        required: false,
      },
      setsResults: [
        {
          setNumber: {
            type: Number,
            required: true,
          },
          reps: {
            type: Number, // For strength-based exercises
            required: false,
          },
          weight: {
            type: Number, // For weighted exercises
            required: false,
          },
          time: {
            type: Number, // For timed exercises (in seconds)
            required: false,
          },
        },
      ],
    },
  ],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const WorkoutResultsSchema = mongoose.model('WorkoutResults', workoutResultsSchema);
export default WorkoutResultsSchema;
