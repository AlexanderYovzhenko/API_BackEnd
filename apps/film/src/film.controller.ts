import { Controller, Inject } from '@nestjs/common';
import { FilmService } from './film.service';
import { SharedService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  ICreateFilm,
  IQueryParamsFilter,
  IUpdateGenre,
} from './interfaces/film.service.interfaces';

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
  async getAllFilms(
    @Ctx() context: RmqContext,
    @Payload() queryLimit: { limit: string },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.getAllFilms(queryLimit);
  }

  @MessagePattern({ cmd: 'get_films_by_id' })
  async getFilmsById(
    @Ctx() context: RmqContext,
    @Payload() filmsId: { films: string[] },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.getFilmsById(filmsId);
  }

  @MessagePattern({ cmd: 'get_films_by_name' })
  async getFilmsByName(
    @Ctx() context: RmqContext,
    @Payload() queryName: { name: string },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.getFilmsByName(queryName);
  }

  @MessagePattern({ cmd: 'get_filtered_films' })
  async getFilteredFilms(
    @Ctx() context: RmqContext,
    @Payload()
    query: IQueryParamsFilter,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.getFilteredFilms(query);
  }

  @MessagePattern({ cmd: 'add_film' })
  async addFilm(@Ctx() context: RmqContext, @Payload() film: ICreateFilm) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.addFilm(film);
  }

  @MessagePattern({ cmd: 'update_film_name' })
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

  @MessagePattern({ cmd: 'get_genre' })
  async getGenre(@Ctx() context: RmqContext, @Payload() genre_id: string) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.getGenre(genre_id);
  }

  @MessagePattern({ cmd: 'get_all_genres' })
  async getAllGenres(
    @Ctx() context: RmqContext,
    @Payload() queryLimit: { limit: string },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.getAllGenres(queryLimit);
  }

  @MessagePattern({ cmd: 'update_genre_name' })
  async updateGenre(
    @Ctx() context: RmqContext,
    @Payload()
    data: IUpdateGenre,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.filmService.updateGenre(data);
  }
}
