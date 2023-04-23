import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { FilmRole } from '../film-role/film_role.entity';
import { PersonFilmRole } from './person_film_role.entity';
import { FilmPerson } from './film_person.entity';

interface PersonCreationAttrs {
  person_id: string;
  first_name_ru: string;
  last_name_ru: string;
  first_name_en: string;
  last_name_en: string;
  description: string;
  img: string;
}

@Table({ tableName: 'person', timestamps: false })
export class Person extends Model<Person, PersonCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly person_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  first_name_ru: string;

  @Column({ type: DataType.STRING, allowNull: false })
  last_name_ru: string;

  @Column({ type: DataType.STRING, allowNull: false })
  first_name_en: string;

  @Column({ type: DataType.STRING, allowNull: false })
  last_name_en: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  img: string;

  @HasMany(() => FilmPerson, {
    foreignKey: 'person_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  films: FilmPerson[];

  @BelongsToMany(() => FilmRole, () => PersonFilmRole)
  filmRoles: FilmRole[];
}
