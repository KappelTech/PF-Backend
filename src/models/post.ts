// import mongoose from 'mongoose';
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  creator: object;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
});

// module.exports = mongoose.model('Post', postSchema);

const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);

export default Post;
