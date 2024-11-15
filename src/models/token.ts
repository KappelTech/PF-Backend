import mongoose, { Schema, Document, Model } from 'mongoose';

interface IToken extends Document {
  email: string;
  code: string;
  createdAt: Date;
  expiresAt: Date;
}

const tokenSchema = new Schema<IToken>({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that each email only has one active code
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '10m', // Automatically remove the document after 10 minutes
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Token: Model<IToken> = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
