import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the TypeScript interface for the SearchHistory document
interface ISearchHistory extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  exerciseId: mongoose.Schema.Types.ObjectId;
  exerciseName?: string;
  searchCount: number;
  lastSearchedAt: Date;
}

// Define the schema for SearchHistory
const searchHistorySchema = new Schema<ISearchHistory>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  exerciseName: { type: String },
  searchCount: { type: Number, default: 1 },
  lastSearchedAt: { type: Date, default: Date.now },
});

// Create the model using the schema and the interface
const SearchHistory: Model<ISearchHistory> = mongoose.model<ISearchHistory>('SearchHistory', searchHistorySchema);

export default SearchHistory;
