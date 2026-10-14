import { api } from './client';
import { Course } from './admin';

export type CourseDocument = {
  id: number;
  courseId: number;
  originalFilename: string;
  ingestStatus: 'pending' | 'processing' | 'ready' | 'failed';
  ingestError: string | null;
  createdAt: string;
};

export function listFacultyCourses() {
  return api<{ courses: Course[] }>('/api/faculty/courses');
}

export function listDocuments(courseId: number) {
  return api<{ documents: CourseDocument[] }>(`/api/faculty/courses/${courseId}/documents`);
}

export function uploadDocument(courseId: number, file: File) {
  const body = new FormData();
  body.append('file', file);
  return api<{ document: CourseDocument }>(`/api/faculty/courses/${courseId}/documents`, {
    method: 'POST',
    body
  });
}
