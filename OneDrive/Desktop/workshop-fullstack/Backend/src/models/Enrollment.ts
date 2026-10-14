import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type EnrollmentStatus = 'enrolled' | 'dropped';

interface EnrollmentAttrs {
  id: number;
  courseId: number;
  studentUserId: number;
  status: EnrollmentStatus;
  enrolledAt: Date;
  droppedAt: Date | null;
}

type EnrollmentCreation = Optional<EnrollmentAttrs, 'id' | 'status' | 'enrolledAt' | 'droppedAt'>;

export class Enrollment extends Model<EnrollmentAttrs, EnrollmentCreation> implements EnrollmentAttrs {
  declare id: number;
  declare courseId: number;
  declare studentUserId: number;
  declare status: EnrollmentStatus;
  declare enrolledAt: Date;
  declare droppedAt: Date | null;
}

Enrollment.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    courseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    studentUserId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: { type: DataTypes.ENUM('enrolled', 'dropped'), allowNull: false, defaultValue: 'enrolled' },
    enrolledAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    droppedAt: { type: DataTypes.DATE, allowNull: true }
  },
  { sequelize, tableName: 'enrollments', underscored: true }
);
