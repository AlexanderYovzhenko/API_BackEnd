import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from '../film/film.entity';
import { FilmCountry } from './film_country.entity';

interface CountryCreationAttrs {
  country_id: string;
  country: string;
  slug: string;
}

@Table({ tableName: 'country', timestamps: false })
export class Country extends Model<Country, CountryCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly country_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  country: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @BelongsToMany(() => Film, () => FilmCountry)
  films: Film[];
}
