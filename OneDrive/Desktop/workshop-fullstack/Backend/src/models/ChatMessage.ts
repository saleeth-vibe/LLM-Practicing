import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type MessageRole = 'user' | 'assistant';

interface ChatMessageAttrs {
  id: number;
  threadId: number;
  role: MessageRole;
  content: string;
}

type ChatMessageCreation = Optional<ChatMessageAttrs, 'id'>;

export class ChatMessage extends Model<ChatMessageAttrs, ChatMessageCreation> implements ChatMessageAttrs {
  declare id: number;
  declare threadId: number;
  declare role: MessageRole;
  declare content: string;
}

ChatMessage.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    threadId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'assistant'), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false }
  },
  { sequelize, tableName: 'chat_messages', underscored: true }
);
