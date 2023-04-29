import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Role } from './role-entity';
import { User } from 'apps/users/src/entities/users.entity';

interface RoleCreationAttr {
  value: string;
  description: string;
}

@Table({ tableName: 'users_roles' })
export class UsersRoles extends Model<Role, RoleCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id: number;
}
