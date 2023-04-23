import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from '../film/film.entity';
import { Quality } from './quality.entity';

@Table({ tableName: 'film_quality', timestamps: false })
export class FilmQuality extends Model<FilmQuality> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  film_quality_id: string;

  @ForeignKey(() => Film)
  @Column({ type: DataType.STRING })
  film_id: string;

  @ForeignKey(() => Quality)
  @Column({ type: DataType.STRING })
  quality_id: string;
}
