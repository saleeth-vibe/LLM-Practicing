import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type IngestStatus = 'pending' | 'processing' | 'ready' | 'failed';

interface CourseDocumentAttrs {
  id: number;
  courseId: number;
  uploadedByUserId: number;
  originalFilename: string;
  storagePath: string;
  mimeType: string;
  ingestStatus: IngestStatus;
  ingestError: string | null;
}

type CourseDocumentCreation = Optional<CourseDocumentAttrs, 'id' | 'ingestStatus' | 'ingestError'>;

export class CourseDocument extends Model<CourseDocumentAttrs, CourseDocumentCreation> implements CourseDocumentAttrs {
  declare id: number;
  declare courseId: number;
  declare uploadedByUserId: number;
  declare originalFilename: string;
  declare storagePath: string;
  declare mimeType: string;
  declare ingestStatus: IngestStatus;
  declare ingestError: string | null;
}

CourseDocument.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    courseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    uploadedByUserId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    originalFilename: { type: DataTypes.STRING(255), allowNull: false },
    storagePath: { type: DataTypes.STRING(512), allowNull: false },
    mimeType: { type: DataTypes.STRING(128), allowNull: false },
    ingestStatus: {
      type: DataTypes.ENUM('pending', 'processing', 'ready', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    ingestError: { type: DataTypes.TEXT, allowNull: true }
  },
  { sequelize, tableName: 'course_documents', underscored: true }
);
