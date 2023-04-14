import { Module } from '@nestjs/common';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';

@Module({
  imports: [],
  controllers: [FilmController],
  providers: [FilmService],
})
export class FilmModule {}
