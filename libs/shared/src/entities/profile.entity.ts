import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ProfileCreationAttr {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
}

@Table({ tableName: 'users' })
export class Profile extends Model<Profile, ProfileCreationAttr> {
  @Column({
    type: DataType.UUID,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  user_id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  first_name: string;

  @Column({ type: DataType.STRING })
  last_name: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.STRING })
  city: string;
}
