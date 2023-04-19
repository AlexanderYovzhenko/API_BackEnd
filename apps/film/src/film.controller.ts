import { Controller, Inject } from '@nestjs/common';
import { FilmService } from './film.service';
import { SharedService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class FilmController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private readonly filmService: FilmService,
  ) {}

  @MessagePattern({ cmd: 'get_film' })
  async getFilm(@Ctx() context: RmqContext, @Payload() film_id: string) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.getFilm(film_id);
  }

  @MessagePattern({ cmd: 'get_all_films' })
  async getAllFilms(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.getAllFilms();
  }

  @MessagePattern({ cmd: 'get_filtered_films' })
  async getFilteredFilms(
    @Ctx() context: RmqContext,
    @Payload() query: Record<string, number>,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.getFilteredFilms(query);
  }

  @MessagePattern({ cmd: 'add_film' })
  async addFilm(
    @Ctx() context: RmqContext,
    @Payload() film: Record<string, number>,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.addFilm(film);
  }

  @MessagePattern({ cmd: 'update_name_film' })
  async updateFilm(
    @Ctx() context: RmqContext,
    @Payload()
    data: { film_id: string; name_ru: string; name_en: string },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.updateFilm(
      data.film_id,
      data.name_ru,
      data.name_en,
    );
  }

  @MessagePattern({ cmd: 'delete_film' })
  async deleteFilm(@Ctx() context: RmqContext, @Payload() film_id: string) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.deleteFilm(film_id);
  }
}
