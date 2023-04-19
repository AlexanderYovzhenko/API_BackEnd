import { Module } from '@nestjs/common';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { PostgresDBModule, SharedModule, SharedService } from '@app/shared';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from './entities/film.entity';

@Module({
  imports: [SharedModule, PostgresDBModule, SequelizeModule.forFeature([Film])],
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
