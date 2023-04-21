import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from './film.entity';
import { Genre } from './genre.entity';

@Table({ tableName: 'film_genre', timestamps: false })
export class FilmGenre extends Model<FilmGenre> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  film_genre_id: string;

  @ForeignKey(() => Film)
  @Column({ type: DataType.STRING })
  film_id: string;

  @ForeignKey(() => Genre)
  @Column({ type: DataType.INTEGER })
  genre_id: string;
}
