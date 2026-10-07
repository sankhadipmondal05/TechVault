import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  thumbnail: string;
  category: string;
  featured: boolean;
  order: number;
  popularTopics: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'BookOpen' },
    thumbnail: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    popularTopics: [{ type: String }]
  },
  { timestamps: true }
);

SubjectSchema.index({ featured: 1, order: 1, name: 1 });
SubjectSchema.index({ category: 1, order: 1, name: 1 });
SubjectSchema.index({ name: 'text', description: 'text' });

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
