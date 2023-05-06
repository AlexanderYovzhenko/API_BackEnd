import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.entity';

interface ProfileCreationAttr {
  profile_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
}

@Table({ tableName: 'profile', timestamps: false })
export class Profile extends Model<Profile, ProfileCreationAttr> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  profile_id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  first_name: string;

  @Column({ type: DataType.STRING })
  last_name: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.STRING })
  city: string;

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;
}
