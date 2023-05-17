import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@app/shared';

interface TokenCreationAttrs {
  token_id: string;
  token?: string | null;
  user_id: string;
}

@Table({ tableName: 'token', timestamps: false })
export class Token extends Model<Token, TokenCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly token_id: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  token: string;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;
}
