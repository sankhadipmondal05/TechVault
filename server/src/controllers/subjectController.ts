import { Request, Response, NextFunction } from 'express';
import { Subject } from '../models/Subject.js';

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, featured, search } = req.query;
    const filter: Record<string, any> = {};

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$text = { $search: search as string };
    }

    const subjects = await Subject.find(filter).sort({ order: 1, name: 1 }).lean();
    res.json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    next(error);
  }
};

export const getSubjectBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const subject = await Subject.findOne({ slug }).lean();

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: `Subject with slug '${slug}' not found`
      });
    }

    res.json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    res.json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
