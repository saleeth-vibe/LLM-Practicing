import { useCallback, useEffect, useState } from 'react';
import * as adminApi from '../api/admin';
import { AuthUser } from '../api/auth';

export function useAdmin() {
  const [users, setUsers] = useState<(AuthUser & { isActive: boolean })[]>([]);
  const [departments, setDepartments] = useState<adminApi.Department[]>([]);
  const [courses, setCourses] = useState<adminApi.Course[]>([]);
  const [enrollments, setEnrollments] = useState<adminApi.Enrollment[]>([]);
  const [faculty, setFaculty] = useState<{ id: number; fullName: string; email: string }[]>([]);
  const [students, setStudents] = useState<{ id: number; fullName: string; email: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, deptRes, courseRes, enrollRes, optionRes] = await Promise.all([
        adminApi.listUsers(),
        adminApi.listDepartments(),
        adminApi.listCourses(),
        adminApi.listEnrollments(),
        adminApi.options()
      ]);
      setUsers(userRes.users);
      setDepartments(deptRes.departments);
      setCourses(courseRes.courses);
      setEnrollments(enrollRes.enrollments);
      setFaculty(optionRes.faculty);
      setStudents(optionRes.students);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    users,
    departments,
    courses,
    enrollments,
    faculty,
    students,
    error,
    loading,
    refresh,
    createUser: adminApi.createUser,
    setUserActive: adminApi.setUserActive,
    createDepartment: adminApi.createDepartment,
    createCourse: adminApi.createCourse,
    updateCourse: adminApi.updateCourse,
    enrollStudent: adminApi.enrollStudent,
    dropEnrollment: adminApi.dropEnrollment
  };
}
