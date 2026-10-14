import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface DocumentChunkAttrs {
  id: number;
  documentId: number;
  courseId: number;
  chunkIndex: number;
  content: string;
  embedding: number[];
}

type DocumentChunkCreation = Optional<DocumentChunkAttrs, 'id'>;

export class DocumentChunk extends Model<DocumentChunkAttrs, DocumentChunkCreation> implements DocumentChunkAttrs {
  declare id: number;
  declare documentId: number;
  declare courseId: number;
  declare chunkIndex: number;
  declare content: string;
  declare embedding: number[];
}

DocumentChunk.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    documentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    courseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    chunkIndex: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    embedding: { type: DataTypes.JSON, allowNull: false }
  },
  { sequelize, tableName: 'document_chunks', underscored: true }
);
