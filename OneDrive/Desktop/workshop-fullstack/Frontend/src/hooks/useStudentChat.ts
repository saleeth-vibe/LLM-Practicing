import { useCallback, useEffect, useState } from 'react';
import { Course } from '../api/admin';
import { ChatMessage, getThread, listStudentCourses, sendMessage } from '../api/student';

export function useStudentChat() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    listStudentCourses()
      .then((result) => {
        setCourses(result.courses);
        setCourseId(result.courses[0]?.id ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!courseId) return;
    getThread(courseId)
      .then((result) => setMessages(result.messages))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load chat'));
  }, [courseId]);

  const send = useCallback(
    async (prompt: string) => {
      if (!courseId) return;
      setSending(true);
      setError(null);
      try {
        const result = await sendMessage(courseId, prompt);
        setMessages((current) => [...current, result.userMessage, result.assistantMessage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setSending(false);
      }
    },
    [courseId]
  );

  return { courses, courseId, setCourseId, messages, error, loading, sending, send };
}
