import { Request, Response, NextFunction } from 'express';
import * as facultyService from '../services/facultyService';

export async function listCourses(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ courses: await facultyService.listFacultyCourses(req.user!.id) });
  } catch (error) {
    next(error);
  }
}

export async function listDocuments(req: Request, res: Response, next: NextFunction) {
  try {
    const documents = await facultyService.listCourseDocuments(req.user!.id, Number(req.params.courseId));
    res.json({ documents });
  } catch (error) {
    next(error);
  }
}

export async function uploadDocument(req: Request, res: Response, next: NextFunction) {
  try {
    const document = await facultyService.uploadCourseDocument(
      req.user!.id,
      Number(req.params.courseId),
      req.file
    );
    res.status(201).json({ document });
  } catch (error) {
    next(error);
  }
}
