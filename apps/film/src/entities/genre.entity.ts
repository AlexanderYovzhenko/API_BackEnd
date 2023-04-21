import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from './film.entity';
import { FilmGenre } from './film_genre.entity';

interface GenreCreationAttrs {
  genre_id: string;
  genre_ru: string;
  genre_en?: string;
}

@Table({ tableName: 'genre', timestamps: false })
export class Genre extends Model<Genre, GenreCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  readonly genre_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  genre_ru: string;

  @Column({ type: DataType.STRING, allowNull: true })
  genre_en: string;

  @BelongsToMany(() => Film, () => FilmGenre)
  films: Film[];
}
