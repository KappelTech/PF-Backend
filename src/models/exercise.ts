import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the interface for the Exercise document
interface IExercise extends Document {
  name: string;
  category?: string;
  muscle?: string;
  equipment?: string;
  difficulty?: string;
  instructions?: string;
}

// Define the schema for exercises
const exerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  category: { type: String },
  muscle: { type: String },
  equipment: { type: String },
  difficulty: { type: String },
  instructions: { type: String },
  // Add any other fields that are in your collection
});

// Create the Exercise model
const Exercise: Model<IExercise> = mongoose.model<IExercise>('Exercise', exerciseSchema);

export default Exercise;
