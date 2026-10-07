import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

CategorySchema.index({ order: 1, name: 1 });
CategorySchema.index({ name: 'text', description: 'text' });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
