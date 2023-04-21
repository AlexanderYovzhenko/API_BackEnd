import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from './film.entity';
import { Language } from './language.entity';

@Table({ tableName: 'film_language_audio', timestamps: false })
export class FilmLanguageAudio extends Model<FilmLanguageAudio> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  film_language_audio_id: number;

  @ForeignKey(() => Film)
  @Column({ type: DataType.STRING })
  film_id: string;

  @ForeignKey(() => Language)
  @Column({ type: DataType.INTEGER })
  language_id: number;
}
