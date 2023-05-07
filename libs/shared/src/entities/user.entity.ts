import {
  BelongsToMany,
  Column,
  DataType,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Profile } from './profile.entity';
import { Role } from './role.entity';
import { UserRole } from './user_role.entity';

interface UserCreationAttr {
  user_id: string;
  email: string;
  password: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreationAttr> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  user_id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasOne(() => Profile, {
    foreignKey: 'user_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];
}
