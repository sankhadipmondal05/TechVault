import { Request, Response, NextFunction } from 'express';
import { Course } from '../models/Course.js';
import { OneShot } from '../models/OneShot.js';
import { Subject } from '../models/Subject.js';

export const globalSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, type, subject, level } = req.query;
    const queryStr = (q as string || '').trim();

    if (!queryStr) {
      return res.json({
        success: true,
        query: '',
        counts: { total: 0, courses: 0, oneShots: 0, subjects: 0 },
        data: { courses: [], oneShots: [], subjects: [] }
      });
    }

    const regex = new RegExp(queryStr, 'i');

    const courseFilter: Record<string, any> = {
      $or: [
        { title: regex },
        { description: regex },
        { instructor: regex },
        { tags: { $in: [regex] } },
        { 'modules.title': regex },
        { 'modules.lessons.title': regex }
      ]
    };

    const oneShotFilter: Record<string, any> = {
      $or: [
        { title: regex },
        { description: regex },
        { instructor: regex },
        { tags: { $in: [regex] } }
      ]
    };

    const subjectFilter: Record<string, any> = {
      $or: [
        { name: regex },
        { description: regex },
        { popularTopics: { $in: [regex] } }
      ]
    };

    if (subject) {
      courseFilter.subjectSlug = subject;
      oneShotFilter.subjectSlug = subject;
    }

    if (level && level !== 'All Levels') {
      courseFilter.level = level;
      oneShotFilter.level = level;
    }

    const fetchCourses = (!type || type === 'all' || type === 'course')
      ? Course.find(courseFilter)
          .select('-modules')
          .populate('subject', 'name slug icon category')
          .limit(20)
          .lean()
      : Promise.resolve([]);

    const fetchOneShots = (!type || type === 'all' || type === 'one-shot')
      ? OneShot.find(oneShotFilter)
          .populate('subject', 'name slug icon category')
          .limit(20)
          .lean()
      : Promise.resolve([]);

    const fetchSubjects = (!type || type === 'all' || type === 'subject')
      ? Subject.find(subjectFilter).limit(10).lean()
      : Promise.resolve([]);

    const [courses, oneShots, subjects] = await Promise.all([
      fetchCourses,
      fetchOneShots,
      fetchSubjects
    ]);

    const total = courses.length + oneShots.length + subjects.length;

    res.json({
      success: true,
      query: queryStr,
      counts: {
        total,
        courses: courses.length,
        oneShots: oneShots.length,
        subjects: subjects.length
      },
      data: {
        courses,
        oneShots,
        subjects
      }
    });
  } catch (error) {
    next(error);
  }
};
