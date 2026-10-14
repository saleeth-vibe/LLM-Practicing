import { api } from './client';
import { AuthUser, Role } from './auth';

export type Department = { id: number; name: string; code: string };
export type Course = {
  id: number;
  departmentId: number;
  code: string;
  title: string;
  facultyUserId: number | null;
  isActive: boolean;
  Department?: Department;
  faculty?: { id: number; fullName: string; email: string } | null;
};
export type Enrollment = {
  id: number;
  courseId: number;
  studentUserId: number;
  status: 'enrolled' | 'dropped';
  enrolledAt: string;
  droppedAt: string | null;
  Course?: Course;
  student?: { id: number; fullName: string; email: string };
};

export function listUsers() {
  return api<{ users: (AuthUser & { isActive: boolean })[] }>('/api/admin/users');
}
export function createUser(body: { email: string; password: string; fullName: string; role: Role }) {
  return api('/api/admin/users', { method: 'POST', body: JSON.stringify(body) });
}
export function setUserActive(id: number, isActive: boolean) {
  return api(`/api/admin/users/${id}/active`, { method: 'PATCH', body: JSON.stringify({ isActive }) });
}
export function listDepartments() {
  return api<{ departments: Department[] }>('/api/admin/departments');
}
export function createDepartment(body: { name: string; code: string }) {
  return api('/api/admin/departments', { method: 'POST', body: JSON.stringify(body) });
}
export function listCourses() {
  return api<{ courses: Course[] }>('/api/admin/courses');
}
export function createCourse(body: {
  departmentId: number;
  code: string;
  title: string;
  facultyUserId: number | null;
}) {
  return api('/api/admin/courses', { method: 'POST', body: JSON.stringify(body) });
}
export function updateCourse(id: number, body: { title?: string; facultyUserId?: number | null; isActive?: boolean }) {
  return api(`/api/admin/courses/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}
export function listEnrollments() {
  return api<{ enrollments: Enrollment[] }>('/api/admin/enrollments');
}
export function enrollStudent(body: { courseId: number; studentUserId: number }) {
  return api('/api/admin/enrollments', { method: 'POST', body: JSON.stringify(body) });
}
export function dropEnrollment(id: number) {
  return api(`/api/admin/enrollments/${id}/drop`, { method: 'PATCH' });
}
export function options() {
  return api<{
    faculty: { id: number; fullName: string; email: string }[];
    students: { id: number; fullName: string; email: string }[];
  }>('/api/admin/options');
}
