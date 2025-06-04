import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  image?: string;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);
