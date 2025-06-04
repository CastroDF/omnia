import mongoose, { Schema, Document } from 'mongoose';

export interface IRender extends Document {
  name: string;
  description?: string;
  slug: string;
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  files: {
    obj: {
      key: string;
      url: string;
      originalName: string;
    };
    mtl: {
      key: string;
      url: string;
      originalName: string;
    };
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const RenderSchema = new Schema<IRender>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    slug: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },
    files: {
      obj: {
        key: { type: String, required: true },
        url: { type: String, required: true },
        originalName: { type: String, required: true },
      },
      mtl: {
        key: { type: String, required: true },
        url: { type: String, required: true },
        originalName: { type: String, required: true },
      },
    },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'renders',
    timestamps: true, // Automatically handles createdAt and updatedAt
  },
);

export const Render =
  mongoose.models.Render || mongoose.model<IRender>('Render', RenderSchema);
