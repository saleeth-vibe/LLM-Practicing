import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/adminService';

export async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ users: await adminService.listUsers() });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await adminService.createUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function setUserActive(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await adminService.setUserActive(Number(req.params.id), Boolean(req.body.isActive));
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

export async function listDepartments(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ departments: await adminService.listDepartments() });
  } catch (error) {
    next(error);
  }
}

export async function createDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const department = await adminService.createDepartment(req.body);
    res.status(201).json({ department });
  } catch (error) {
    next(error);
  }
}

export async function listCourses(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ courses: await adminService.listCourses() });
  } catch (error) {
    next(error);
  }
}

export async function createCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const course = await adminService.createCourse(req.body);
    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
}

export async function updateCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const course = await adminService.updateCourse(Number(req.params.id), req.body);
    res.json({ course });
  } catch (error) {
    next(error);
  }
}

export async function listEnrollments(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ enrollments: await adminService.listEnrollments() });
  } catch (error) {
    next(error);
  }
}

export async function enrollStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const enrollment = await adminService.enrollStudent(req.body);
    res.status(201).json({ enrollment });
  } catch (error) {
    next(error);
  }
}

export async function dropEnrollment(req: Request, res: Response, next: NextFunction) {
  try {
    const enrollment = await adminService.dropEnrollment(Number(req.params.id));
    res.json({ enrollment });
  } catch (error) {
    next(error);
  }
}

export async function options(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      faculty: await adminService.facultyOptions(),
      students: await adminService.studentOptions()
    });
  } catch (error) {
    next(error);
  }
}
