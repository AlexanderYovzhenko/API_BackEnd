import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Person } from '../person/person.entity';
import { PersonFilmRole } from '../person/person_film_role.entity';

interface FilmRoleCreationAttrs {
  film_role_id: string;
  film_role: string;
  slug: string;
}

@Table({ tableName: 'film_role', timestamps: false })
export class FilmRole extends Model<FilmRole, FilmRoleCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly film_role_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  film_role: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @BelongsToMany(() => Person, () => PersonFilmRole)
  persons: Person[];
}
