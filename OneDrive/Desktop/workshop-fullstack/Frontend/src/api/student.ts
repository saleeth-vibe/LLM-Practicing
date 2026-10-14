import { api } from './client';
import { Course } from './admin';

export type ChatMessage = {
  id: number;
  threadId: number;
  role: 'user' | 'assistant';
  content: string;
};

export function listStudentCourses() {
  return api<{ courses: Course[] }>('/api/student/courses');
}

export function getThread(courseId: number) {
  return api<{ thread: { id: number }; messages: ChatMessage[] }>(`/api/student/courses/${courseId}/thread`);
}

export function sendMessage(courseId: number, prompt: string) {
  return api<{
    userMessage: ChatMessage;
    assistantMessage: ChatMessage;
    sources: string[];
  }>(`/api/student/courses/${courseId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ prompt })
  });
}
