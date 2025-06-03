import mongoose, { Schema, Document } from 'mongoose';

export interface IRender extends Document {
  title: string;
  slug: string;
  objUrl: string;
  mtlUrl: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const RenderSchema = new Schema<IRender>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    objUrl: { type: String, required: true },
    mtlUrl: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'renders',
  }
);

export const Render =
  mongoose.models.Render || mongoose.model<IRender>('Render', RenderSchema);
