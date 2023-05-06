import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
