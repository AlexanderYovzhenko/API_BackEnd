import { Module } from '@nestjs/common';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { PostgresDBModule, SharedModule, SharedService } from '@app/shared';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  Film,
  FilmGenre,
  FilmLanguageAudio,
  FilmLanguageSubtitle,
  Genre,
  Language,
  Trailer,
  Quality,
  FilmQuality,
  Country,
  FilmCountry,
} from './entities';

@Module({
  imports: [
    SharedModule,
    PostgresDBModule,
    SequelizeModule.forFeature([
      Film,
      Quality,
      FilmQuality,
      Trailer,
      Language,
      FilmLanguageAudio,
      FilmLanguageSubtitle,
      Genre,
      FilmGenre,
      Country,
      FilmCountry,
    ]),
    SharedModule.registerRmq(
      'PERSON_SERVICE',
      process.env.RABBITMQ_PERSON_QUEUE,
    ),
  ],
  controllers: [FilmController],
  providers: [
    FilmService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class FilmModule {}
