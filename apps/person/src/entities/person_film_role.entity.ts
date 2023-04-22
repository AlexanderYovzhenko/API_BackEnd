import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { FilmRole } from './film_role.entity';
import { Person } from './person.entity';

@Table({ tableName: 'person_film_role', timestamps: false })
export class PersonFilmRole extends Model<PersonFilmRole> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  person_film_role_id: string;

  @ForeignKey(() => Person)
  @Column({ type: DataType.STRING })
  person_id: string;

  @ForeignKey(() => FilmRole)
  @Column({ type: DataType.STRING })
  film_role_id: string;
}
