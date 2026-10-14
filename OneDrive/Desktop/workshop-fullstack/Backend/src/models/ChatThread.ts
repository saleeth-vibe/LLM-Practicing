import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ChatThreadAttrs {
  id: number;
  studentUserId: number;
  courseId: number;
}

type ChatThreadCreation = Optional<ChatThreadAttrs, 'id'>;

export class ChatThread extends Model<ChatThreadAttrs, ChatThreadCreation> implements ChatThreadAttrs {
  declare id: number;
  declare studentUserId: number;
  declare courseId: number;
}

ChatThread.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    studentUserId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    courseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
  },
  { sequelize, tableName: 'chat_threads', underscored: true }
);
