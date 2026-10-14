import { Request, Response, NextFunction } from 'express';
import * as studentService from '../services/studentService';

export async function listCourses(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ courses: await studentService.listStudentCourses(req.user!.id) });
  } catch (error) {
    next(error);
  }
}

export async function getThread(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await studentService.getOrCreateThread(req.user!.id, Number(req.params.courseId));
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await studentService.sendStudentMessage(
      req.user!.id,
      Number(req.params.courseId),
      req.body.prompt ?? ''
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}
