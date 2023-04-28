import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';

interface RoleCreationAttr {
  value: string;
  description: string;
}
import { User } from '../../../users/src/entities/users.entity';
import { Role } from './role-entity';

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
