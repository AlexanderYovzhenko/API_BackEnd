import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@app/shared';

interface CommentCreationAttrs {
  comment_id: string;
  title?: string | null;
  text: string;
  // like: string;
  film_id?: string | null;
  parent_id?: string | null;
  user_id: string;
}

@Table({ tableName: 'comment' })
export class Comment extends Model<Comment, CommentCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly comment_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  // @Column({ type: DataType.STRING, allowNull: false })
  // like: string;

  @Column({ type: DataType.STRING, allowNull: true })
  film_id: string;

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;

  @HasMany(() => Comment, {
    foreignKey: 'parent_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  sub_comments: Comment[];
}
