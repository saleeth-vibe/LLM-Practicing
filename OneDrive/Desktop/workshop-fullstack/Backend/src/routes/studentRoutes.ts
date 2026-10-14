import { Router } from 'express';
import { getThread, listCourses, sendMessage } from '../controllers/studentController';
import { requireAuth, requireRole } from '../middleware/auth';

export const studentRoutes = Router();

studentRoutes.use(requireAuth, requireRole('student'));
studentRoutes.get('/courses', listCourses);
studentRoutes.get('/courses/:courseId/thread', getThread);
studentRoutes.post('/courses/:courseId/messages', sendMessage);
