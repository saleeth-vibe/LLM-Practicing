import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database';
import { HttpError } from '../httpError';
import { Course, Department, Enrollment, User } from '../models';
import { UserRole } from '../types';

function requireText(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${field} is required`);
  }
  return value.trim();
}

export async function listUsers() {
  return User.findAll({
    attributes: ['id', 'email', 'fullName', 'role', 'isActive', 'createdAt'],
    order: [['id', 'ASC']]
  });
}

export async function createUser(input: {
  email?: string;
  password?: string;
  fullName?: string;
  role?: UserRole;
}) {
  const email = requireText(input.email, 'Email').toLowerCase();
  const password = requireText(input.password, 'Password');
  const fullName = requireText(input.fullName, 'Full name');
  if (!input.role || !['admin', 'faculty', 'student'].includes(input.role)) {
    throw new HttpError(400, 'Role must be admin, faculty, or student');
  }
  if (password.length < 8) {
    throw new HttpError(400, 'Password must be at least 8 characters');
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new HttpError(409, 'A user with this email already exists');
  }

  return User.create({
    email,
    passwordHash: await bcrypt.hash(password, 10),
    fullName,
    role: input.role,
    isActive: true
  });
}

export async function setUserActive(id: number, isActive: boolean) {
  const user = await User.findByPk(id);
  if (!user) throw new HttpError(404, 'User not found');
  user.isActive = isActive;
  await user.save();
  return user;
}

export async function listDepartments() {
  return Department.findAll({ order: [['code', 'ASC']] });
}

export async function createDepartment(input: { name?: string; code?: string }) {
  const name = requireText(input.name, 'Name');
  const code = requireText(input.code, 'Code').toUpperCase();
  const existing = await Department.findOne({ where: { code } });
  if (existing) throw new HttpError(409, 'Department code already exists');
  return Department.create({ name, code });
}

export async function listCourses() {
  return Course.findAll({
    include: [
      { model: Department },
      { model: User, as: 'faculty', attributes: ['id', 'fullName', 'email'] }
    ],
    order: [['id', 'ASC']]
  });
}

export async function createCourse(input: {
  departmentId?: number;
  code?: string;
  title?: string;
  facultyUserId?: number | null;
}) {
  const departmentId = Number(input.departmentId);
  const code = requireText(input.code, 'Course code').toUpperCase();
  const title = requireText(input.title, 'Title');
  if (!departmentId) throw new HttpError(400, 'Department is required');

  const department = await Department.findByPk(departmentId);
  if (!department) throw new HttpError(404, 'Department not found');

  let facultyUserId: number | null = null;
  if (input.facultyUserId) {
    const faculty = await User.findByPk(input.facultyUserId);
    if (!faculty || faculty.role !== 'faculty' || !faculty.isActive) {
      throw new HttpError(400, 'Faculty assignment must be an active faculty user');
    }
    facultyUserId = faculty.id;
  }

  const duplicate = await Course.findOne({ where: { departmentId, code } });
  if (duplicate) throw new HttpError(409, 'Course code already exists in this department');

  return Course.create({ departmentId, code, title, facultyUserId, isActive: true });
}

export async function updateCourse(
  id: number,
  input: { title?: string; facultyUserId?: number | null; isActive?: boolean }
) {
  const course = await Course.findByPk(id);
  if (!course) throw new HttpError(404, 'Course not found');

  if (input.title !== undefined) {
    course.title = requireText(input.title, 'Title');
  }
  if (input.facultyUserId !== undefined) {
    if (input.facultyUserId === null) {
      course.facultyUserId = null;
    } else {
      const faculty = await User.findByPk(input.facultyUserId);
      if (!faculty || faculty.role !== 'faculty' || !faculty.isActive) {
        throw new HttpError(400, 'Faculty assignment must be an active faculty user');
      }
      course.facultyUserId = faculty.id;
    }
  }
  if (input.isActive !== undefined) {
    course.isActive = Boolean(input.isActive);
  }
  await course.save();
  return course;
}

export async function listEnrollments() {
  return Enrollment.findAll({
    include: [
      { model: Course },
      { model: User, as: 'student', attributes: ['id', 'fullName', 'email'] }
    ],
    order: [['id', 'DESC']]
  });
}

export async function enrollStudent(input: { courseId?: number; studentUserId?: number }) {
  const courseId = Number(input.courseId);
  const studentUserId = Number(input.studentUserId);
  if (!courseId || !studentUserId) {
    throw new HttpError(400, 'Course and student are required');
  }

  return sequelize.transaction(async (transaction) => {
    const course = await Course.findByPk(courseId, { transaction });
    if (!course || !course.isActive) throw new HttpError(400, 'Course is not available');

    const student = await User.findByPk(studentUserId, { transaction });
    if (!student || student.role !== 'student' || !student.isActive) {
      throw new HttpError(400, 'Enrollment must be an active student');
    }

    const active = await Enrollment.findOne({
      where: { courseId, studentUserId, status: 'enrolled' },
      transaction
    });
    if (active) throw new HttpError(409, 'Student is already enrolled in this course');

    return Enrollment.create(
      { courseId, studentUserId, status: 'enrolled', enrolledAt: new Date(), droppedAt: null },
      { transaction }
    );
  });
}

export async function dropEnrollment(id: number) {
  const enrollment = await Enrollment.findByPk(id);
  if (!enrollment) throw new HttpError(404, 'Enrollment not found');
  if (enrollment.status === 'dropped') {
    throw new HttpError(409, 'Enrollment is already dropped');
  }
  enrollment.status = 'dropped';
  enrollment.droppedAt = new Date();
  await enrollment.save();
  return enrollment;
}

export async function facultyOptions() {
  return User.findAll({
    where: { role: 'faculty', isActive: true },
    attributes: ['id', 'fullName', 'email'],
    order: [['fullName', 'ASC']]
  });
}

export async function studentOptions() {
  return User.findAll({
    where: { role: 'student', isActive: true },
    attributes: ['id', 'fullName', 'email'],
    order: [['fullName', 'ASC']]
  });
}
