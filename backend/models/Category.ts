import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  icon: string;
  count: number;
  description: string;
  slug: string;
}

const CategorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: 'category' },
  count: { type: Number, default: 0 },
  description: { type: String, default: '' },
  slug: { type: String, required: true, lowercase: true },
});

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
