import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { UserRole } from '../types';

interface UserAttrs {
  id: number;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
}

type UserCreation = Optional<UserAttrs, 'id' | 'isActive'>;

export class User extends Model<UserAttrs, UserCreation> implements UserAttrs {
  declare id: number;
  declare email: string;
  declare passwordHash: string;
  declare fullName: string;
  declare role: UserRole;
  declare isActive: boolean;
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    fullName: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'faculty', 'student'), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: 'users', underscored: true }
);
