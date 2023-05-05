import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from '../film/film.entity';
import { Country } from './country.entity';

@Table({ tableName: 'film_country', timestamps: false })
export class FilmCountry extends Model<FilmCountry> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  film_country_id: string;

  @ForeignKey(() => Film)
  @Column({ type: DataType.STRING })
  film_id: string;

  @ForeignKey(() => Country)
  @Column({ type: DataType.STRING })
  country_id: string;
}
