import { useCallback, useEffect, useState } from 'react';
import { Course } from '../api/admin';
import * as facultyApi from '../api/faculty';

export function useFaculty() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<facultyApi.CourseDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await facultyApi.listFacultyCourses();
      setCourses(result.courses);
      setSelectedCourseId((current) => current ?? result.courses[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDocuments = useCallback(async (courseId: number) => {
    const result = await facultyApi.listDocuments(courseId);
    setDocuments(result.documents);
  }, []);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (!selectedCourseId) return;
    void loadDocuments(selectedCourseId).catch((err) => {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    });
  }, [selectedCourseId, loadDocuments]);

  return {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    documents,
    error,
    loading,
    refreshDocuments: () => (selectedCourseId ? loadDocuments(selectedCourseId) : Promise.resolve()),
    uploadDocument: facultyApi.uploadDocument
  };
}
