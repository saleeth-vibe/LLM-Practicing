import { env } from '../config/env';
import { HttpError } from '../httpError';
import { ChatMessage, ChatThread, Course, Department, Enrollment } from '../models';
import { answerWithRag, retrieveCourseContext } from './ragService';

export async function listStudentCourses(studentUserId: number) {
  const enrollments = await Enrollment.findAll({
    where: { studentUserId, status: 'enrolled' },
    include: [{ model: Course, include: [Department] }]
  });
  return enrollments
    .map((row) => row.get('Course') as Course | undefined)
    .filter((course): course is Course => Boolean(course && course.isActive));
}

async function requireEnrollment(studentUserId: number, courseId: number) {
  const enrollment = await Enrollment.findOne({
    where: { studentUserId, courseId, status: 'enrolled' },
    include: [{ model: Course }]
  });
  const course = enrollment?.get('Course') as Course | undefined;
  if (!enrollment || !course || !course.isActive) {
    throw new HttpError(403, 'You are not enrolled in this course');
  }
  return course;
}

export async function getOrCreateThread(studentUserId: number, courseId: number) {
  await requireEnrollment(studentUserId, courseId);
  const existing = await ChatThread.findOne({
    where: { studentUserId, courseId },
    order: [['id', 'DESC']]
  });
  if (existing) {
    const messages = await ChatMessage.findAll({
      where: { threadId: existing.id },
      order: [['id', 'ASC']]
    });
    return { thread: existing, messages };
  }
  const thread = await ChatThread.create({ studentUserId, courseId });
  return { thread, messages: [] as ChatMessage[] };
}

export async function sendStudentMessage(studentUserId: number, courseId: number, prompt: string) {
  const question = prompt.trim();
  if (!question) throw new HttpError(400, 'Prompt is required');
  if (!env.openaiApiKey) {
    throw new HttpError(503, 'LLM API key is not configured on the server');
  }

  const course = await requireEnrollment(studentUserId, courseId);
  const { thread } = await getOrCreateThread(studentUserId, courseId);
  const userMessage = await ChatMessage.create({
    threadId: thread.id,
    role: 'user',
    content: question
  });

  const context = await retrieveCourseContext(courseId, question);
  if (context.length === 0) {
    const content =
      'This course does not have any ready study materials yet. Ask your faculty to upload resources.';
    const assistantMessage = await ChatMessage.create({
      threadId: thread.id,
      role: 'assistant',
      content
    });
    return { userMessage, assistantMessage, sources: [] };
  }

  const answer = await answerWithRag(course.title, question, context);
  const assistantMessage = await ChatMessage.create({
    threadId: thread.id,
    role: 'assistant',
    content: answer
  });
  return { userMessage, assistantMessage, sources: context.map((item) => item.content.slice(0, 240)) };
}
