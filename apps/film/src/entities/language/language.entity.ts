import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from '../film/film.entity';
import { FilmLanguageAudio } from './film_language_audio.entity';
import { FilmLanguageSubtitle } from './film_language_subtitle.entity';

interface LanguageCreationAttrs {
  language_id: string;
  language: string;
  slug: string;
}

@Table({ tableName: 'language', timestamps: false })
export class Language extends Model<Language, LanguageCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly language_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  language: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @BelongsToMany(() => Film, () => FilmLanguageAudio)
  filmsAudio: Film[];

  @BelongsToMany(() => Film, () => FilmLanguageSubtitle)
  filmsSubtitle: Film[];
}
