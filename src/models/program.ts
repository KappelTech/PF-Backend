import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  // workouts: {type: mongoose.Schema.Types.ObjectId, ref: "Workout"},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
});

const ProgramSchema = mongoose.model('Program', programSchema);

export default ProgramSchema;
