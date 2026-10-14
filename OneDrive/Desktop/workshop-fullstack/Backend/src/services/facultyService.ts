import path from 'path';
import { HttpError } from '../httpError';
import { Course, CourseDocument, Department } from '../models';
import { ingestDocument } from './ragService';

const allowedExt = new Set(['.pdf', '.docx', '.txt', '.md']);

export async function listFacultyCourses(facultyUserId: number) {
  return Course.findAll({
    where: { facultyUserId, isActive: true },
    include: [{ model: Department }],
    order: [['code', 'ASC']]
  });
}

export async function listCourseDocuments(facultyUserId: number, courseId: number) {
  const course = await Course.findOne({ where: { id: courseId, facultyUserId } });
  if (!course) throw new HttpError(404, 'Course not found or not assigned to you');
  return CourseDocument.findAll({ where: { courseId }, order: [['id', 'DESC']] });
}

export async function uploadCourseDocument(
  facultyUserId: number,
  courseId: number,
  file: Express.Multer.File | undefined
) {
  if (!file) throw new HttpError(400, 'A file is required');
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExt.has(ext)) {
    throw new HttpError(400, 'Only PDF, DOCX, TXT, and MD files are allowed');
  }

  const course = await Course.findOne({ where: { id: courseId, facultyUserId, isActive: true } });
  if (!course) throw new HttpError(404, 'Course not found or not assigned to you');

  const document = await CourseDocument.create({
    courseId,
    uploadedByUserId: facultyUserId,
    originalFilename: file.originalname,
    storagePath: file.path,
    mimeType: file.mimetype || 'application/octet-stream',
    ingestStatus: 'pending',
    ingestError: null
  });

  void ingestDocument(document.id);
  return document;
}
