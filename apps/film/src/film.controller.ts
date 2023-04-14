import { Controller, Get } from '@nestjs/common';
import { FilmService } from './film.service';

@Controller()
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Get()
  getHello(): string {
    return this.filmService.getHello();
  }
}
