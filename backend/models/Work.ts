import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWork extends Document {
  title: string;
  creatorId?: mongoose.Types.ObjectId;
  creatorName: string;
  creatorAvatar: string;
  category: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'starting' | 'hourly';
  turnaround: string;
  rating: number;
  reviewsCount: number;
  location: string;
  img: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkSchema: Schema<IWork> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User' },
    creatorName: { type: String, required: true, trim: true },
    creatorAvatar: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    priceType: { type: String, enum: ['fixed', 'starting', 'hourly'], default: 'fixed' },
    turnaround: { type: String, default: '1-2 weeks' },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    location: { type: String, default: 'Remote / Nationwide' },
    img: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Work: Model<IWork> =
  mongoose.models.Work || mongoose.model<IWork>('Work', WorkSchema);
