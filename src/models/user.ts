import mongoose, { Schema, Document, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'client' | 'admin';
  active: boolean;
  personalTrainingClient: boolean;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    default: 'client',
    enum: ['client', 'admin'],
  },
  active: {
    type: Boolean,
    default: false,
    required: true,
  },
  personalTrainingClient: {
    type: Boolean,
    default: false,
    required: true,
  },
});

userSchema.plugin(uniqueValidator);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
