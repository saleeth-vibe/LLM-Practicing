import { Router } from 'express';
import {
  createCourse,
  createDepartment,
  createUser,
  dropEnrollment,
  enrollStudent,
  listCourses,
  listDepartments,
  listEnrollments,
  listUsers,
  options,
  setUserActive,
  updateCourse
} from '../controllers/adminController';
import { requireAuth, requireRole } from '../middleware/auth';

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireRole('admin'));
adminRoutes.get('/users', listUsers);
adminRoutes.post('/users', createUser);
adminRoutes.patch('/users/:id/active', setUserActive);
adminRoutes.get('/departments', listDepartments);
adminRoutes.post('/departments', createDepartment);
adminRoutes.get('/courses', listCourses);
adminRoutes.post('/courses', createCourse);
adminRoutes.patch('/courses/:id', updateCourse);
adminRoutes.get('/enrollments', listEnrollments);
adminRoutes.post('/enrollments', enrollStudent);
adminRoutes.patch('/enrollments/:id/drop', dropEnrollment);
adminRoutes.get('/options', options);
