import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from '../film/film.entity';

interface TrailerCreationAttrs {
  trailer_id: string;
  trailer: string;
  film_id: string;
}

@Table({ tableName: 'trailer', timestamps: false })
export class Trailer extends Model<Trailer, TrailerCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly trailer_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  trailer: string;

  @BelongsTo(() => Film, { foreignKey: 'film_id' })
  film: Film;
}
