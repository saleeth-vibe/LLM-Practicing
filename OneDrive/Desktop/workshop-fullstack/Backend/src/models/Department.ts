import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface DepartmentAttrs {
  id: number;
  name: string;
  code: string;
}

type DepartmentCreation = Optional<DepartmentAttrs, 'id'>;

export class Department extends Model<DepartmentAttrs, DepartmentCreation> implements DepartmentAttrs {
  declare id: number;
  declare name: string;
  declare code: string;
}

Department.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(32), allowNull: false, unique: true }
  },
  { sequelize, tableName: 'departments', underscored: true }
);
