import { Request, Response, NextFunction } from 'express';
import { Course } from '../models/Course.js';

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      subject,
      subjectSlug,
      level,
      language,
      featured,
      search,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const filter: Record<string, any> = {};

    if (subject) filter.subject = subject;
    if (subjectSlug) filter.subjectSlug = subjectSlug;
    if (level && level !== 'All Levels') filter.level = level;
    if (language) filter.language = language;
    if (featured === 'true') filter.featured = true;

    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { instructor: { $regex: search as string, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    let sortOption: Record<string, any> = { createdAt: -1 };
    if (sort === 'popular') sortOption = { totalLessons: -1, createdAt: -1 };
    if (sort === 'title' || sort === 'a-z') sortOption = { title: 1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .select('-modules')
        .populate('subject', 'name slug icon category')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Course.countDocuments(filter)
    ]);

    res.json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug })
      .populate('subject', 'name slug icon category popularTopics')
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with slug '${slug}' not found`
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

export const getCoursesBySubjectSlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug } = req.params;
    const courses = await Course.find({ subjectSlug })
      .select('-modules')
      .populate('subject', 'name slug icon category')
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
