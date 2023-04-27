import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from '../film/film.entity';
import { FilmGenre } from './film_genre.entity';

interface GenreCreationAttrs {
  genre_id: string;
  genre_ru: string;
  genre_en: string;
  slug: string;
}

@Table({ tableName: 'genre', timestamps: false })
export class Genre extends Model<Genre, GenreCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly genre_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  genre_ru: string;

  @Column({ type: DataType.STRING, allowNull: true })
  genre_en: string;

  @Column({ type: DataType.STRING, allowNull: true })
  slug: string;

  @BelongsToMany(() => Film, () => FilmGenre)
  films: Film[];
}
