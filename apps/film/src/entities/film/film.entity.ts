import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Trailer } from '../trailer/trailer.entity';
import { Language } from '../language/language.entity';
import { FilmLanguageAudio } from '../language/film_language_audio.entity';
import { FilmLanguageSubtitle } from '../language/film_language_subtitle.entity';
import { Genre } from '../genre/genre.entity';
import { FilmGenre } from '../genre/film_genre.entity';
import { Quality } from '../quality/quality.entity';
import { FilmQuality } from '../quality/film_quality.entity';

interface FilmCreationAttrs {
  film_id: string;
  name_ru: string;
  name_en?: string;
  description: string;
  year: number;
  country: string;
  rating: number;
  assessments: number;
  reviews: number;
  quality: string;
  age_limit: number;
  duration: string;
}

@Table({ tableName: 'film', timestamps: false })
export class Film extends Model<Film, FilmCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly film_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name_ru: string;

  @Column({ type: DataType.STRING, allowNull: true })
  name_en: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  year: number;

  @Column({ type: DataType.STRING, allowNull: false })
  country: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  rating: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  assessments: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  reviews: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  age_limit: number;

  @Column({ type: DataType.STRING, allowNull: false })
  duration: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  img: string;

  @HasMany(() => Trailer, {
    foreignKey: 'film_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  trailers: Trailer[];

  @BelongsToMany(() => Quality, () => FilmQuality)
  qualities: Quality[];

  @BelongsToMany(() => Language, () => FilmLanguageAudio)
  languagesAudio: Language[];

  @BelongsToMany(() => Language, () => FilmLanguageSubtitle)
  languagesSubtitle: Language[];

  @BelongsToMany(() => Genre, () => FilmGenre)
  genres: Genre[];
}
