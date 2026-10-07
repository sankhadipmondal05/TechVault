import mongoose, { Schema, Document } from 'mongoose';

export interface IOneShot extends Document {
  title: string;
  slug: string;
  description: string;
  subject: mongoose.Types.ObjectId;
  subjectSlug: string;
  instructor: string;
  youtubeVideoId: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OneShotSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: '' },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    subjectSlug: { type: String, required: true, index: true },
    instructor: { type: String, required: true, trim: true },
    youtubeVideoId: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    duration: { type: String, default: '2h 00m' },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
      index: true
    },
    language: { type: String, default: 'English' },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

OneShotSchema.index({ featured: 1, createdAt: -1 });
OneShotSchema.index({ subjectSlug: 1, featured: -1, createdAt: -1 });
OneShotSchema.index({ level: 1, createdAt: -1 });

OneShotSchema.index(
  {
    title: 'text',
    description: 'text',
    instructor: 'text',
    tags: 'text'
  },
  { language_override: 'none' }
);

export const OneShot = mongoose.model<IOneShot>('OneShot', OneShotSchema);
