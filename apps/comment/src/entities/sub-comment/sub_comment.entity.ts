import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Comment } from '../comment/comment.entity';

interface SubCommentCreationAttrs {
  sub_comment_id: string;
  title?: string;
  text: string;
}

@Table({ tableName: 'sub_comment' })
export class SubComment extends Model<SubComment, SubCommentCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly sub_comment_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @Column({ type: DataType.STRING, allowNull: false })
  user_id: string;

  @BelongsTo(() => Comment, { foreignKey: 'comment_id' })
  comment: Comment;
}
