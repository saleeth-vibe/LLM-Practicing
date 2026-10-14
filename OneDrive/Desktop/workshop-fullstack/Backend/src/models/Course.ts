import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CourseAttrs {
  id: number;
  departmentId: number;
  code: string;
  title: string;
  facultyUserId: number | null;
  isActive: boolean;
}

type CourseCreation = Optional<CourseAttrs, 'id' | 'facultyUserId' | 'isActive'>;

export class Course extends Model<CourseAttrs, CourseCreation> implements CourseAttrs {
  declare id: number;
  declare departmentId: number;
  declare code: string;
  declare title: string;
  declare facultyUserId: number | null;
  declare isActive: boolean;
}

Course.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    departmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    code: { type: DataTypes.STRING(32), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    facultyUserId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: 'courses', underscored: true }
);
