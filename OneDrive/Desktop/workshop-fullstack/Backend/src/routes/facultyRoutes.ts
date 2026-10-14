import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { listCourses, listDocuments, uploadDocument } from '../controllers/facultyController';
import { requireAuth, requireRole } from '../middleware/auth';

const uploadDir = path.resolve(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^\w.\-]+/g, '_');
      cb(null, `${Date.now()}-${safe}`);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }
});

export const facultyRoutes = Router();

facultyRoutes.use(requireAuth, requireRole('faculty'));
facultyRoutes.get('/courses', listCourses);
facultyRoutes.get('/courses/:courseId/documents', listDocuments);
facultyRoutes.post('/courses/:courseId/documents', upload.single('file'), uploadDocument);
