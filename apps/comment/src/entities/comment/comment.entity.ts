import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { SubComment } from '../sub-comment/sub_comment.entity';

interface CommentCreationAttrs {
  comment_id: string;
  title?: string;
  text: string;
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

  @Column({ type: DataType.STRING, allowNull: false })
  film_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  user_id: string;

  @HasMany(() => SubComment, {
    foreignKey: 'comment_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  sub_comments: SubComment[];
}
