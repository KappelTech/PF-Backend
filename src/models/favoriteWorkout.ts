import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the FavoriteWorkout document
interface IFavoriteWorkout extends Document {
  workout: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
}

// Define the schema for favorite workouts
const favoriteWorkoutSchema = new Schema<IFavoriteWorkout>({
  workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Create the FavoriteWorkout model
const FavoriteWorkout: Model<IFavoriteWorkout> = mongoose.model<IFavoriteWorkout>(
  'FavoriteWorkout',
  favoriteWorkoutSchema,
);

export default FavoriteWorkout;
