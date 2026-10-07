import { Request, Response, NextFunction } from 'express';
import { OneShot } from '../models/OneShot.js';

export const getOneShots = async (req: Request, res: Response, next: NextFunction) => {
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
    if (sort === 'title' || sort === 'a-z') sortOption = { title: 1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [oneShots, total] = await Promise.all([
      OneShot.find(filter)
        .populate('subject', 'name slug icon category')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      OneShot.countDocuments(filter)
    ]);

    res.json({
      success: true,
      count: oneShots.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: oneShots
    });
  } catch (error) {
    next(error);
  }
};

export const getOneShotBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const oneShot = await OneShot.findOne({ slug })
      .populate('subject', 'name slug icon category')
      .lean();

    if (!oneShot) {
      return res.status(404).json({
        success: false,
        message: `One-Shot with slug '${slug}' not found`
      });
    }

    // Also get related one-shots
    const related = await OneShot.find({
      subjectSlug: oneShot.subjectSlug,
      _id: { $ne: oneShot._id }
    })
      .limit(4)
      .populate('subject', 'name slug icon category')
      .lean();

    res.json({
      success: true,
      data: oneShot,
      related
    });
  } catch (error) {
    next(error);
  }
};

export const getOneShotsBySubjectSlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug } = req.params;
    const oneShots = await OneShot.find({ subjectSlug })
      .populate('subject', 'name slug icon category')
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: oneShots.length,
      data: oneShots
    });
  } catch (error) {
    next(error);
  }
};

export const createOneShot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oneShot = await OneShot.create(req.body);
    res.status(201).json({
      success: true,
      data: oneShot
    });
  } catch (error) {
    next(error);
  }
};

export const updateOneShot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oneShot = await OneShot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!oneShot) {
      return res.status(404).json({ success: false, message: 'One-Shot not found' });
    }

    res.json({
      success: true,
      data: oneShot
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOneShot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oneShot = await OneShot.findByIdAndDelete(req.params.id);
    if (!oneShot) {
      return res.status(404).json({ success: false, message: 'One-Shot not found' });
    }
    res.json({
      success: true,
      message: 'One-Shot deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
