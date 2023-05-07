import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Role } from './role.entity';
import { User } from '@app/shared';

@Table({ tableName: 'user_role', timestamps: false })
export class UserRole extends Model<UserRole> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  user_role_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role_id: string;
}
