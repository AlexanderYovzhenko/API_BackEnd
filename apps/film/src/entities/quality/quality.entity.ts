import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from '../film/film.entity';
import { FilmQuality } from './film_quality.entity';

interface QualityCreationAttrs {
  quality_id: string;
  quality: string;
  film_id: string;
}

@Table({ tableName: 'quality', timestamps: false })
export class Quality extends Model<Quality, QualityCreationAttrs> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  readonly quality_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  quality: string;

  @BelongsToMany(() => Film, () => FilmQuality)
  filmsQuality: Film[];
}
