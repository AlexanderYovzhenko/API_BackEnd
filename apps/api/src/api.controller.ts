import { ClientProxy } from '@nestjs/microservices';
import validator from 'validator';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateFilmDto,
  CreatePersonsFilmDto,
  FilmsIdQueryDto,
  FilmsNameQueryDto,
  FilterQueryDto,
  LimitQueryDto,
  PersonQueryDto,
  UpdateFilmNameDto,
  UpdateGenreNameDto,
  CreateUserDto,
  CreateRoleDto,
  CreateUserRoleDto,
} from './dto';
import { RolesGuard } from './guards/roles_guard';
import { Roles } from './guards/roles_auth_decorator';

@ApiTags('Endpoints')
@ApiBearerAuth()
@Controller()
export class ApiController {
  constructor(
    @Inject('FILM_SERVICE') private readonly filmService: ClientProxy,
    @Inject('PERSON_SERVICE') private readonly personService: ClientProxy,
    @Inject('USERS_SERVICE') private readonly usersService: ClientProxy,
    @Inject('ROLES_SERVICE') private readonly rolesService: ClientProxy,
    private readonly apiService: ApiService,
  ) {}

  @ApiOperation({ summary: 'check server' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  checkServer(): string {
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

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'get all films' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('films')
  async getAllFilms(@Query() queryLimit: LimitQueryDto) {
    return this.filmService.send(
      {
        cmd: 'get_all_films',
      },

      queryLimit,
    );
  }

  @ApiOperation({ summary: 'get films by id' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('id/films')
  async getFilmsById(@Query() filmsId: FilmsIdQueryDto) {
    const { films } = filmsId;

    if (!films) {
      return [];
    }

    if (typeof films === 'string') {
      const isUUID = this.checkUUID(films);

      if (!isUUID) {
        throw new BadRequestException('film_id is not UUID');
      }
    }

    if (Array.isArray(films)) {
      filmsId.films.forEach((film_id) => {
        const isUUID = this.checkUUID(film_id);

        if (!isUUID) {
          throw new BadRequestException('film_id is not UUID');
        }
      });
    }

    return this.filmService.send(
      {
        cmd: 'get_films_by_id',
      },

      filmsId,
    );
  }

  @ApiOperation({ summary: 'get films by name' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('name/films')
  async getFilmsByName(@Query() queryName: FilmsNameQueryDto) {
    return this.filmService.send(
      {
        cmd: 'get_films_by_name',
      },

      queryName,
    );
  }

  @ApiOperation({ summary: 'get filtered films' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('filter/films')
  async getFilteredFilms(
    @Query()
    query: FilterQueryDto,
  ) {
    return this.filmService.send(
      {
        cmd: 'get_filtered_films',
      },

      query,
    );
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
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

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'update film name' })
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
          cmd: 'update_film_name',
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

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
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

  @ApiOperation({ summary: 'get genre by id' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @Get('genres/:genre_id')
  async getGenre(@Param('genre_id') genre_id: string) {
    const isUUID = this.checkUUID(genre_id);

    if (!isUUID) {
      throw new BadRequestException('genre_id is not UUID');
    }

    const genre = await firstValueFrom(
      this.filmService.send(
        {
          cmd: 'get_genre',
        },

        genre_id,
      ),
    );

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return genre;
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'get all genres' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('genres')
  async getAllGenres(@Query() queryLimit: LimitQueryDto) {
    const genres = await firstValueFrom(
      this.filmService.send(
        {
          cmd: 'get_all_genres',
        },

        queryLimit,
      ),
    );

    return genres;
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'update genre name' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  @Patch('genres/:genre_id')
  async updateGenreName(
    @Param('genre_id') genre_id: string,
    @Body() genreNames: UpdateGenreNameDto,
  ) {
    const isUUID = this.checkUUID(genre_id);

    if (!isUUID) {
      throw new BadRequestException('genre_id is not UUID');
    }

    const updateGenre = await firstValueFrom(
      this.filmService.send(
        {
          cmd: 'update_genre_name',
        },
        {
          genre_id,
          ...genreNames,
        },
      ),
    );

    if (!updateGenre) {
      throw new NotFoundException('Genre not found');
    }

    return updateGenre;
  }

  @ApiOperation({ summary: 'get person by id' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @Get('persons/:person_id')
  async getPerson(@Param('person_id') person_id: string) {
    const isUUID = this.checkUUID(person_id);

    if (!isUUID) {
      throw new BadRequestException('person_id is not UUID');
    }

    const person = await firstValueFrom(
      this.personService.send(
        {
          cmd: 'get_person',
        },

        person_id,
      ),
    );

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    return person;
  }

  @ApiOperation({ summary: 'get all persons' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('persons')
  async getAllPersons(@Query() queryLimit: LimitQueryDto) {
    const persons = await firstValueFrom(
      this.personService.send(
        {
          cmd: 'get_all_persons',
        },

        queryLimit,
      ),
    );

    return persons;
  }

  @ApiOperation({ summary: 'get persons from film' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('persons/films/:film_id')
  async getPersonsFromFilm(@Param('film_id') film_id: string) {
    const isUUID = this.checkUUID(film_id);

    if (!isUUID) {
      throw new BadRequestException('film_id is not UUID');
    }

    const persons = await firstValueFrom(
      this.personService.send(
        {
          cmd: 'get_persons_from_film',
        },

        film_id,
      ),
    );

    return persons;
  }

  @ApiOperation({ summary: 'get persons who fits' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('filter/persons')
  async getPersonsWhoFits(@Query() person: PersonQueryDto) {
    const persons = await firstValueFrom(
      this.personService.send(
        {
          cmd: 'get_persons_who_fits',
        },

        person,
      ),
    );

    return persons;
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'created persons from film' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('persons')
  async addPersonsFromFilm(@Body() persons: CreatePersonsFilmDto) {
    return this.personService.send(
      {
        cmd: 'add_person',
      },

      persons,
    );
  }

  private checkUUID(uuid: string) {
    return validator.isUUID(uuid);
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('users')
  async getUsers() {
    const users = await firstValueFrom(
      this.usersService.send(
        {
          cmd: 'get all users',
        },
        {},
      ),
    );

    return users;
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'get user by email' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('users/:email')
  async getUser(@Param('user_email') user_email: string) {
    const user = await firstValueFrom(
      this.usersService.send(
        {
          cmd: 'get user by email',
        },

        user_email,
      ),
    );

    return user;
  }

  @ApiOperation({ summary: 'create new user' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('users')
  async createUser(@Body() user: CreateUserDto) {
    return this.usersService.send(
      {
        cmd: 'create user',
      },
      user,
    );
  }

  @ApiOperation({ summary: 'get roles' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('roles')
  async getRoles() {
    return this.rolesService.send(
      {
        cmd: 'get_all_roles',
      },
      {},
    );
  }

  @ApiOperation({ summary: 'create role' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('roles')
  async addRole(@Body() role: CreateRoleDto) {
    return this.rolesService.send(
      {
        cmd: 'create_role',
      },
      role,
    );
  }

  @ApiOperation({ summary: 'create user role' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('user_role')
  async addRoleToUser(@Body() userRole: CreateUserRoleDto) {
    return this.rolesService.send(
      {
        cmd: 'create_user_role',
      },
      userRole,
    );
  }
}
