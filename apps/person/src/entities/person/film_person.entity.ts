import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Person } from './person.entity';

interface FilmPersonCreationAttrs {
  film_person_id: string;
  film_id: string;
  person_id: string;
}

@Table({ tableName: 'film_person', timestamps: false })
export class FilmPerson extends Model<FilmPerson, FilmPersonCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  film_person_id: string;

  @Column({ type: DataType.STRING })
  film_id: string;

  @BelongsTo(() => Person, { foreignKey: 'person_id' })
  person: Person;
}
