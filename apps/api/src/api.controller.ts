import { ClientProxy } from '@nestjs/microservices';
import validator from 'validator';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  CreateProfileDto,
  UpdateProfileDto,
  CreateCommentDto,
  UpdateCommentDto,
  CreatePersonDto,
  CountriesNameQueryDto,
} from './dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles_auth_decorator';
import { AuthGuard } from './guards/jwt_auth.guard';

@ApiBearerAuth()
@Controller()
export class ApiController {
  constructor(
    @Inject('FILM_SERVICE') private readonly filmService: ClientProxy,
    @Inject('PERSON_SERVICE') private readonly personService: ClientProxy,
    @Inject('USERS_SERVICE') private readonly usersService: ClientProxy,
    @Inject('ROLES_SERVICE') private readonly rolesService: ClientProxy,
    @Inject('PROFILE_SERVICE') private readonly profileService: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('COMMENT_SERVICE') private readonly commentService: ClientProxy,

    private readonly apiService: ApiService,
  ) {}

  private checkUUID(uuid: string) {
    return validator.isUUID(uuid);
  }

  @ApiTags('Home')
  @ApiOperation({ summary: 'check server' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  checkServer(): string {
    return this.apiService.checkServer();
  }

  // AUTH ENDPOINTS -------------------------------------------------------------

  @ApiTags('Auth')
  @ApiOperation({ summary: 'login' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Post('login')
  async logIn(@Body() user: CreateUserDto) {
    const token = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'login',
        },

        user,
      ),
    );

    if (!token) {
      throw new ForbiddenException({ message: 'Wrong email or password' });
    }

    return token;
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: 'signup' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Post('signup')
  async signUp(@Body() user: CreateUserDto) {
    const hashedPassword = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'signup',
        },

        user,
      ),
    );

    if (!hashedPassword) {
      throw new BadRequestException('User already exists');
    }

    return this.usersService.send(
      {
        cmd: 'create_user',
      },
      { ...user, password: hashedPassword },
    );
  }

  // USER ENDPOINTS -------------------------------------------------------------

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiTags('User')
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreateUserDto] })
  @Get('users')
  async getUsers() {
    const users = await firstValueFrom(
      this.usersService.send(
        {
          cmd: 'get_all_users',
        },
        {},
      ),
    );

    return users;
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiTags('User')
  @ApiOperation({ summary: 'get user by email' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @Get('users/:email')
  async getUser(@Param('email') email: string) {
    const user = await firstValueFrom(
      this.usersService.send(
        {
          cmd: 'get_user_by_email',
        },

        email,
      ),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @ApiTags('User')
  @ApiOperation({ summary: 'update user (password, login)' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.OK)
  @Patch('users/:user_id')
  async updateUser(
    @Param('user_id') user_id: string,
    @Body() updateUser: CreateUserDto,
  ) {
    const isUUID = this.checkUUID(user_id);

    if (!isUUID) {
      throw new BadRequestException('user_id is not UUID');
    }

    const user = await firstValueFrom(
      this.usersService.send(
        {
          cmd: 'update_user',
        },
        {
          user_id,
          ...updateUser,
        },
      ),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @ApiTags('User')
  @ApiOperation({ summary: 'delete user' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('users/:user_id')
  async deleteUser(@Param('user_id') user_id: string) {
    const isUUID = this.checkUUID(user_id);

    if (!isUUID) {
      throw new BadRequestException('user_id is not UUID');
    }

    const user = await firstValueFrom(
      this.usersService.send(
        {
          cmd: 'delete_user',
        },

        user_id,
      ),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return;
  }

  // PROFILE ENDPOINTS -------------------------------------------------------------

  @ApiTags('Profile')
  @ApiOperation({ summary: 'create profile' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreatePersonDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Post('profiles')
  async createProfile(@Body() newProfile: CreateProfileDto) {
    const isUUID = this.checkUUID(newProfile.user_id);

    if (!isUUID) {
      throw new BadRequestException('user_id is not UUID');
    }

    const profile = await firstValueFrom(
      this.profileService.send(
        {
          cmd: 'create_profile',
        },
        newProfile,
      ),
    );

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    if (profile === 'profile already exists') {
      throw new BadRequestException('profile already exists');
    }

    if (profile === 'phone already exists') {
      throw new BadRequestException('phone already exists');
    }

    return profile;
  }

  @ApiTags('Profile')
  @ApiOperation({ summary: 'get all profiles' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreateProfileDto] })
  @Get('profiles')
  async getProfiles() {
    return this.profileService.send(
      {
        cmd: 'get_all_profiles',
      },
      {},
    );
  }

  @ApiTags('Profile')
  @ApiOperation({ summary: 'get profile by user id' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateProfileDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Get('profiles/:user_id')
  async getProfileById(@Param('user_id') user_id: string) {
    const isUUID = this.checkUUID(user_id);

    if (!isUUID) {
      throw new BadRequestException('user_id is not UUID');
    }

    const profile = await firstValueFrom(
      this.profileService.send(
        {
          cmd: 'get_profile_by_user_id',
        },
        user_id,
      ),
    );

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return profile;
  }

  @ApiTags('Profile')
  @ApiOperation({ summary: 'update profile info' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateProfileDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.OK)
  @Patch('profiles/:user_id')
  async updateProfile(
    @Param('user_id') user_id: string,
    @Body() profileInfo: UpdateProfileDto,
  ) {
    const isUUID = this.checkUUID(user_id);

    if (!isUUID) {
      throw new BadRequestException('user_id is not UUID');
    }

    const updatedProfile = await firstValueFrom(
      this.profileService.send(
        {
          cmd: 'update_profile',
        },
        {
          user_id,
          ...profileInfo,
        },
      ),
    );

    if (!updatedProfile) {
      throw new NotFoundException('Profile not found');
    }

    return updatedProfile;
  }

  @ApiTags('Profile')
  @ApiOperation({ summary: 'delete profile' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('profiles/:user_id')
  async deleteProfile(@Param('user_id') user_id: string) {
    const isUUID = this.checkUUID(user_id);

    if (!isUUID) {
      throw new BadRequestException('user_id is not UUID');
    }

    const deletedProfile = await firstValueFrom(
      this.profileService.send(
        {
          cmd: 'delete_profile',
        },

        user_id,
      ),
    );

    if (!deletedProfile) {
      throw new NotFoundException('Profile not found');
    }

    return;
  }

  // ROLE ENDPOINTS -------------------------------------------------------------

  @ApiTags('Role')
  @ApiOperation({ summary: 'get roles' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(AuthGuard)
  @Get('roles')
  async getRoles() {
    return this.rolesService.send(
      {
        cmd: 'get_all_roles',
      },
      {},
    );
  }

  @ApiTags('Role')
  @ApiOperation({ summary: 'get role by value' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @UseGuards(AuthGuard)
  @Get('roles/:value')
  async getRoleByValue(@Query('value') value: string) {
    const role = await firstValueFrom(
      this.rolesService.send(
        {
          cmd: 'get_role_by_value',
        },

        value,
      ),
    );

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  @ApiTags('Role')
  @ApiOperation({ summary: 'create role' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateRoleDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard)
  @Post('roles')
  async addRole(@Body() role: CreateRoleDto) {
    return this.rolesService.send(
      {
        cmd: 'create_role',
      },
      role,
    );
  }

  @ApiTags('Role')
  @ApiOperation({ summary: 'create user role' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateUserRoleDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard)
  @Post('user_role')
  async addRoleToUser(@Body() userRole: CreateUserRoleDto) {
    return this.rolesService.send(
      {
        cmd: 'create_user_role',
      },
      userRole,
    );
  }

  // FILM ENDPOINTS -------------------------------------------------------------

  @ApiTags('Film')
  @ApiOperation({ summary: 'get film by id' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateFilmDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard)
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
  @ApiTags('Film')
  @ApiOperation({ summary: 'get all films' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreateFilmDto] })
  @UseGuards(AuthGuard)
  @Get('films')
  async getAllFilms(@Query() queryLimit: LimitQueryDto) {
    return this.filmService.send(
      {
        cmd: 'get_all_films',
      },

      queryLimit,
    );
  }

  @ApiTags('Film')
  @ApiOperation({ summary: 'get films by id' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreateFilmDto] })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard)
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

  @ApiTags('Film')
  @ApiOperation({ summary: 'get films by name' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreateFilmDto] })
  @UseGuards(AuthGuard)
  @Get('name/films')
  async getFilmsByName(@Query() queryName: FilmsNameQueryDto) {
    return this.filmService.send(
      {
        cmd: 'get_films_by_name',
      },

      queryName,
    );
  }

  @ApiTags('Film')
  @ApiOperation({ summary: 'get filtered films' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreateFilmDto] })
  @UseGuards(AuthGuard)
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
  @ApiTags('Film')
  @ApiOperation({ summary: 'created film' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateFilmDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard)
  @Post('films')
  async addFilm(@Body() film: CreateFilmDto) {
    const newFilm = await firstValueFrom(
      this.filmService.send(
        {
          cmd: 'add_film',
        },

        film,
      ),
    );

    if (!newFilm) {
      throw new BadRequestException('Film is already exists');
    }

    return newFilm;
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiTags('Film')
  @ApiOperation({ summary: 'update film name' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateFilmDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
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
  @ApiTags('Film')
  @ApiOperation({ summary: 'delete film' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
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

  // COUNTRIES ENDPOINTS -------------------------------------------------------------

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiTags('Country')
  @ApiOperation({ summary: 'get all countries' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(AuthGuard)
  @Get('countries')
  async getAllCountries() {
    const countries = await firstValueFrom(
      this.filmService.send(
        {
          cmd: 'get_all_countries',
        },
        {},
      ),
    );

    return countries;
  }

  @ApiTags('Country')
  @ApiOperation({ summary: 'get country by name' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(AuthGuard)
  @Get('name/countries')
  async getCountriesByName(@Query() queryCountry: CountriesNameQueryDto) {
    const countries = await firstValueFrom(
      this.filmService.send(
        {
          cmd: 'get_countries_by_name',
        },

        queryCountry,
      ),
    );

    return countries;
  }

  // GENRES ENDPOINTS -------------------------------------------------------------

  @ApiTags('Genre')
  @ApiOperation({ summary: 'get genre by id' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateGenreNameDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard)
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
  @ApiTags('Genre')
  @ApiOperation({ summary: 'get all genres' })
  @ApiResponse({ status: HttpStatus.OK, type: [UpdateGenreNameDto] })
  @UseGuards(AuthGuard)
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
  @ApiTags('Genre')
  @ApiOperation({ summary: 'update genre name' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateGenreNameDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
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

  // PERSON ENDPOINTS -------------------------------------------------------------

  @ApiTags('Person')
  @ApiOperation({ summary: 'get person by id' })
  @ApiResponse({ status: HttpStatus.OK, type: CreatePersonDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard)
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

  @ApiTags('Person')
  @ApiOperation({ summary: 'get all persons' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreatePersonDto] })
  @UseGuards(AuthGuard)
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

  @ApiTags('Person')
  @ApiOperation({ summary: 'get persons from film' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreatePersonDto] })
  @UseGuards(AuthGuard)
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

  @ApiTags('Person')
  @ApiOperation({ summary: 'get persons who fits' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreatePersonDto] })
  @UseGuards(AuthGuard)
  @Get('name/persons')
  async getPersonsByName(@Query() person: PersonQueryDto) {
    const persons = await firstValueFrom(
      this.personService.send(
        {
          cmd: 'get_persons_by_name',
        },

        person,
      ),
    );

    return persons;
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @ApiTags('Person')
  @ApiOperation({ summary: 'created persons from film' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard)
  @Post('persons')
  async addPersonsFromFilm(@Body() persons: CreatePersonsFilmDto) {
    return this.personService.send(
      {
        cmd: 'add_person',
      },

      persons,
    );
  }

  // COMMENT ENDPOINTS -------------------------------------------------------------

  @ApiTags('Comment')
  @ApiOperation({ summary: 'create comment to film' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateCommentDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard)
  @Post('comments')
  async addComment(@Body() newComment: CreateCommentDto) {
    const comment = await firstValueFrom(
      this.commentService.send(
        {
          cmd: 'create_comment',
        },
        newComment,
      ),
    );

    if (!comment) {
      throw new BadRequestException('Parent comment not found');
    }

    return comment;
  }

  @ApiTags('Comment')
  @ApiOperation({ summary: 'get all comments of film' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreateCommentDto] })
  @UseGuards(AuthGuard)
  @Get('comments/films/:film_id')
  async getAllCommentFilm(@Param('film_id') film_id: string) {
    const isUUID = this.checkUUID(film_id);

    if (!isUUID) {
      throw new BadRequestException('film_id is not UUID');
    }

    return this.commentService.send(
      {
        cmd: 'get_all_comments_film',
      },
      film_id,
    );
  }

  @ApiTags('Comment')
  @ApiOperation({ summary: 'get comment by id' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateCommentDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard)
  @Get('comments/:comment_id')
  async getOneComment(@Param('comment_id') comment_id: string) {
    const isUUID = this.checkUUID(comment_id);

    if (!isUUID) {
      throw new BadRequestException('comment_id is not UUID');
    }

    const comment = await firstValueFrom(
      this.commentService.send(
        {
          cmd: 'get_comment',
        },
        comment_id,
      ),
    );

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  @ApiTags('Comment')
  @ApiOperation({ summary: 'update comment' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateCommentDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch('comments/:comment_id')
  async updateComment(
    @Param('comment_id') comment_id: string,
    @Body() updateComment: UpdateCommentDto,
  ) {
    const isUUID = this.checkUUID(comment_id);

    if (!isUUID) {
      throw new BadRequestException('comment_id is not UUID');
    }

    const comment = await firstValueFrom(
      this.commentService.send(
        {
          cmd: 'update_comment',
        },
        {
          comment_id,
          updateComment,
        },
      ),
    );
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  @ApiTags('Comment')
  @ApiOperation({ summary: 'delete comment' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @Delete('comments/:comment_id')
  async deleteComment(@Param('comment_id') comment_id: string) {
    const isUUID = this.checkUUID(comment_id);

    if (!isUUID) {
      throw new BadRequestException('comment_id is not UUID');
    }

    const comment = await firstValueFrom(
      this.commentService.send(
        {
          cmd: 'delete_comment',
        },
        comment_id,
      ),
    );

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
}
