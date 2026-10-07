import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  youtubeVideoId: string;
  duration: string;
  order: number;
  resources: Array<{ title: string; url: string }>;
  important: boolean;
}

export interface IModule {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  subject: mongoose.Types.ObjectId;
  subjectSlug: string;
  instructor: string;
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;
  totalDuration: string;
  totalLessons: number;
  featured: boolean;
  tags: string[];
  modules: IModule[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  youtubeVideoId: { type: String, required: true },
  duration: { type: String, default: '15m' },
  order: { type: Number, required: true },
  resources: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true }
    }
  ],
  important: { type: Boolean, default: false }
});

const ModuleSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, required: true },
  lessons: [LessonSchema]
});

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: '' },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    subjectSlug: { type: String, required: true, index: true },
    instructor: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '' },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
      index: true
    },
    language: { type: String, default: 'English' },
    totalDuration: { type: String, default: '5h 00m' },
    totalLessons: { type: Number, default: 0 },
    featured: { type: Boolean, default: false, index: true },
    tags: [{ type: String }],
    modules: [ModuleSchema]
  },
  { timestamps: true }
);

CourseSchema.index({ featured: 1, createdAt: -1 });
CourseSchema.index({ subjectSlug: 1, featured: -1, createdAt: -1 });
CourseSchema.index({ level: 1, createdAt: -1 });

CourseSchema.index(
  {
    title: 'text',
    description: 'text',
    instructor: 'text',
    tags: 'text'
  },
  { language_override: 'none' }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
