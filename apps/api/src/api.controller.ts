import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiService } from './api.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CreateFilmDto } from './dto/film-dto/create-film.dto';
import { PaginationQueryDto } from './dto/film-dto/pagination-query.dto';
import { firstValueFrom } from 'rxjs';
import { UpdateFilmNameDto } from './dto/film-dto/update-film-name.dto';
import validator from 'validator';

@ApiTags('Endpoints')
@ApiBearerAuth()
@Controller()
export class ApiController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('FILM_SERVICE') private readonly filmService: ClientProxy,
    private readonly apiService: ApiService,
  ) {}

  @ApiOperation({ summary: 'check server' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  getHello(): string {
    return this.apiService.checkServer();
  }

  @ApiOperation({ summary: 'get film by id' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @Get('films/:film_id')
  async getFilm(@Param('film_id') film_id: string) {
    const isUUID = this.checkUUID(film_id);
    if (!isUUID) {
      throw new BadRequestException('film_id is not UUID');
    }

    const film = await firstValueFrom(
      this.filmService.send(
        {
          cmd: 'get_film',
        },

        film_id,
      ),
    );

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    return film;
  }

  @ApiOperation({ summary: 'get all films' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('films')
  async getAllFilms() {
    return this.filmService.send(
      {
        cmd: 'get_all_films',
      },
      {},
    );
  }

  @ApiOperation({ summary: 'get filtered films' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('filter/films')
  async getFilteredFilms(
    @Query()
    query: PaginationQueryDto,
  ) {
    return this.filmService.send(
      {
        cmd: 'get_filtered_films',
      },

      query,
    );
  }

  @ApiOperation({ summary: 'created film' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('films')
  async addFilm(@Body() film: CreateFilmDto) {
    return this.filmService.send(
      {
        cmd: 'add_film',
      },

      film,
    );
  }

  @ApiOperation({ summary: 'update film' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  @Patch('films/:film_id')
  async updateFilmName(
    @Param('film_id') film_id: string,
    @Body() filmNames: UpdateFilmNameDto,
  ) {
    const isUUID = this.checkUUID(film_id);

    if (!isUUID) {
      throw new BadRequestException('film_id is not UUID');
    }

    const updateFilm = await firstValueFrom(
      this.filmService.send(
        {
          cmd: 'update_name_film',
        },
        {
          film_id,
          ...filmNames,
        },
      ),
    );

    if (!updateFilm) {
      throw new NotFoundException('Film not found');
    }

    return updateFilm;
  }

  @ApiOperation({ summary: 'delete film' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('films/:film_id')
  async deleteFilm(@Param('film_id') film_id: string) {
    const isUUID = this.checkUUID(film_id);

    if (!isUUID) {
      throw new BadRequestException('film_id is not UUID');
    }

    const deleteFilm = await firstValueFrom(
      this.filmService.send(
        {
          cmd: 'delete_film',
        },

        film_id,
      ),
    );

    if (!deleteFilm) {
      throw new NotFoundException('Film not found');
    }

    return deleteFilm;
  }

  private checkUUID(uuid: string) {
    return validator.isUUID(uuid);
  }
}
