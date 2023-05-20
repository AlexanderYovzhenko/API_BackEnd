import { ClientProxy } from '@nestjs/microservices';
import validator from 'validator';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { Request, Response } from 'express';
import { AuthGuard as NestAuth } from '@nestjs/passport';
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
  Req,
  Res,
  UnauthorizedException,
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
  CountriesNameQueryDto,
} from './dto';
import { AuthGuard } from './guards/jwt_auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles_auth_decorator';
import { RolesOrSelfUserGuard } from './guards/roles_or_self_user.guard';
import {
  schemaComment,
  schemaCountry,
  schemaCreateUser,
  schemaError,
  schemaFilm,
  schemaGenre,
  schemaLogin,
  schemaLoginGoogleVK,
  schemaPerson,
  schemaProfile,
  schemaRole,
  schemaUser,
  schemaUserRole,
} from './schemas';
import { RequestWithUser } from './interface/request.interface';
import { ConfigService } from '@nestjs/config';
import { Profile, Role, User, UserRole } from '@app/shared';

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
    private configService: ConfigService,
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
  @ApiOperation({ summary: 'signup' })
  @ApiResponse({ status: HttpStatus.CREATED, schema: schemaCreateUser })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
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
      throw new BadRequestException('user already exists');
    }

    return this.usersService.send(
      {
        cmd: 'create_user',
      },
      { ...user, password: hashedPassword },
    );
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: 'login' })
  @ApiResponse({ status: HttpStatus.CREATED, schema: schemaLogin })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @Post('login')
  async logIn(@Body() user: CreateUserDto, @Res() res: Response) {
    const tokens = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'login',
        },

        user,
      ),
    );

    if (!tokens) {
      throw new ForbiddenException({ message: 'wrong email or password' });
    }

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.json({ accessToken: tokens.accessToken });
  }

  @ApiTags('Auth')
  @UseGuards(NestAuth('google'))
  @Get('google/login')
  async google() {
    return;
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: 'google login' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaLogin })
  @ApiResponse({ status: HttpStatus.CREATED, schema: schemaLoginGoogleVK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @UseGuards(NestAuth('google'))
  @Get('google/login/callback')
  async googleLogin(@Req() req: RequestWithUser, @Res() res: Response) {
    const CLIENT_URL = this.configService.get('CLIENT_URL');

    if (!req.hasOwnProperty('user')) {
      res.header('Error', 'user not found');
      res.redirect(CLIENT_URL);
      return;
    }

    const { user } = req;

    if (!user.hasOwnProperty('email')) {
      res.header('Error', 'email not found');
      res.redirect(CLIENT_URL);
      return;
    }

    const { email } = user;

    const tokens = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'google_login',
        },
        email,
      ),
    );

    if (!tokens) {
      res.header('Error', 'email not found');
      res.redirect(CLIENT_URL);
      return;
    }

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    if (tokens.hasOwnProperty('password')) {
      res.status(HttpStatus.CREATED);

      res.header(
        'UserData',
        JSON.stringify({ email: tokens.email, password: tokens.password }),
      );
      res.header('AccessToken', tokens.accessToken);
      res.redirect(CLIENT_URL);
      return;
    }

    res.header('UserData', JSON.stringify({ email: tokens.email }));
    res.header('AccessToken', tokens.accessToken);
    res.redirect(CLIENT_URL);
    return;
  }

  @ApiTags('Auth')
  @UseGuards(NestAuth('vk'))
  @Get('vk/login')
  async vk() {
    return;
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: 'vk login' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaLogin })
  @ApiResponse({ status: HttpStatus.CREATED, schema: schemaLoginGoogleVK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @Get('vk/login/callback')
  async vkLogin(@Query('code') code: string, @Res() res: Response) {
    const CLIENT_URL = this.configService.get('CLIENT_URL');

    const tokens = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'vk_login',
        },
        code,
      ),
    );

    if (!tokens) {
      res.header('Error', 'email not found');
      res.redirect(CLIENT_URL);
      return;
    }

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    if (tokens.hasOwnProperty('password')) {
      res.status(HttpStatus.CREATED);

      res.header(
        'UserData',
        JSON.stringify({ email: tokens.email, password: tokens.password }),
      );
      res.header('AccessToken', tokens.accessToken);
      res.redirect(CLIENT_URL);
      return;
    }

    res.header('UserData', JSON.stringify({ email: tokens.email }));
    res.header('AccessToken', tokens.accessToken);
    res.redirect(CLIENT_URL);
    return;
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: 'refresh access token' })
  @ApiResponse({ status: HttpStatus.CREATED, schema: schemaLogin })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @Post('refresh')
  async Refresh(@Req() req: Request, @Res() res: Response) {
    if (!req.hasOwnProperty('cookies')) {
      throw new BadRequestException('cookies not found');
    }

    if (!req.cookies.hasOwnProperty('refreshToken')) {
      throw new UnauthorizedException({
        message: 'user unauthorized',
      });
    }

    const { refreshToken } = req.cookies;

    const tokens = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'refresh',
        },

        refreshToken,
      ),
    );

    if (!tokens) {
      throw new UnauthorizedException({
        message: 'user unauthorized',
      });
    }

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.json({ email: tokens.email, accessToken: tokens.accessToken });
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: 'logout' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @HttpCode(HttpStatus.OK)
  @Delete('logout')
  async logOut(@Req() req: Request, @Res() res: Response) {
    if (!req.hasOwnProperty('cookies')) {
      throw new BadRequestException('cookies not found');
    }

    if (!req.cookies.hasOwnProperty('refreshToken')) {
      throw new BadRequestException('refresh token not found');
    }

    const { refreshToken } = req.cookies;

    const result = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'logout',
        },

        refreshToken,
      ),
    );

    res.clearCookie('refreshToken');
    return res.json(result);
  }

  // USER ENDPOINTS -------------------------------------------------------------

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('User')
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaUser },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @Get('users')
  async getUsers(): Promise<User[]> {
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

  @ApiTags('User')
  @ApiOperation({ summary: 'get user by email' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaUser })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @Get('users/:email')
  async getUser(@Param('email') email: string): Promise<User> {
    const user = await firstValueFrom(
      this.usersService.send(
        {
          cmd: 'get_user_by_email',
        },

        email,
      ),
    );

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Roles('ADMIN')
  @UseGuards(RolesOrSelfUserGuard)
  @UseGuards(AuthGuard)
  @ApiTags('User')
  @ApiOperation({ summary: 'update user (password, login)' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaUser })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @HttpCode(HttpStatus.OK)
  @Patch('users/:user_id')
  async updateUser(
    @Param('user_id') user_id: string,
    @Body() updateUser: CreateUserDto,
  ): Promise<User> {
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
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Roles('ADMIN')
  @UseGuards(RolesOrSelfUserGuard)
  @UseGuards(AuthGuard)
  @ApiTags('User')
  @ApiOperation({ summary: 'delete user' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('users/:user_id')
  async deleteUser(@Param('user_id') user_id: string): Promise<void> {
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
      throw new NotFoundException('user not found');
    }

    return;
  }

  // PROFILE ENDPOINTS -------------------------------------------------------------

  @UseGuards(AuthGuard)
  @ApiTags('Profile')
  @ApiOperation({ summary: 'create profile' })
  @ApiResponse({ status: HttpStatus.CREATED, schema: schemaProfile })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @Post('profiles')
  async createProfile(@Body() newProfile: CreateProfileDto): Promise<Profile> {
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
      throw new NotFoundException('user not found');
    }

    if (profile === 'profile already exists') {
      throw new BadRequestException('profile already exists');
    }

    if (profile === 'phone already exists') {
      throw new BadRequestException('phone already exists');
    }

    return profile;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Profile')
  @ApiOperation({ summary: 'get all profiles' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaProfile },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @Get('profiles')
  async getProfiles() {
    return this.profileService.send(
      {
        cmd: 'get_all_profiles',
      },
      {},
    );
  }

  @Roles('ADMIN')
  @UseGuards(RolesOrSelfUserGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Profile')
  @ApiOperation({ summary: 'get profile by user id' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaProfile })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @Get('profiles/:user_id')
  async getProfileById(@Param('user_id') user_id: string): Promise<Profile> {
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
      throw new NotFoundException('user not found');
    }

    return profile;
  }

  @Roles('ADMIN')
  @UseGuards(RolesOrSelfUserGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Profile')
  @ApiOperation({ summary: 'update profile info' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaProfile })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @HttpCode(HttpStatus.OK)
  @Patch('profiles/:user_id')
  async updateProfile(
    @Param('user_id') user_id: string,
    @Body() profileInfo: UpdateProfileDto,
  ): Promise<Profile> {
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
          ...profileInfo,
          user_id,
        },
      ),
    );

    if (!updatedProfile) {
      throw new NotFoundException('profile not found');
    }

    return updatedProfile;
  }

  @Roles('ADMIN')
  @UseGuards(RolesOrSelfUserGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Profile')
  @ApiOperation({ summary: 'delete profile' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('profiles/:user_id')
  async deleteProfile(@Param('user_id') user_id: string): Promise<void> {
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
      throw new NotFoundException('profile not found');
    }

    return;
  }

  // ROLE ENDPOINTS -------------------------------------------------------------

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Role')
  @ApiOperation({ summary: 'create role' })
  @ApiResponse({ status: HttpStatus.CREATED, schema: schemaRole })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @Post('roles')
  async addRole(@Body() newRole: CreateRoleDto): Promise<Role> {
    const role = await firstValueFrom(
      this.rolesService.send(
        {
          cmd: 'create_role',
        },
        newRole,
      ),
    );

    if (!role) {
      throw new BadRequestException('role already exists');
    }

    return role;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Role')
  @ApiOperation({ summary: 'get all roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaRole },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @Get('roles')
  async getRoles() {
    return this.rolesService.send(
      {
        cmd: 'get_all_roles',
      },
      {},
    );
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Role')
  @ApiOperation({ summary: 'get role by value' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaRole })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @Get('roles/:value')
  async getRoleByValue(@Param('value') value: string): Promise<Role> {
    const role = await firstValueFrom(
      this.rolesService.send(
        {
          cmd: 'get_role_by_value',
        },

        value,
      ),
    );

    if (!role) {
      throw new NotFoundException('role not found');
    }

    return role;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Role')
  @ApiOperation({ summary: 'update role' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaRole })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @HttpCode(HttpStatus.OK)
  @Patch('roles/:value')
  async updateRole(
    @Body() updateRole: CreateRoleDto,
    @Param('value') value: string,
  ): Promise<Role> {
    const role = await firstValueFrom(
      this.rolesService.send(
        {
          cmd: 'update_role',
        },
        {
          value,
          updateRole,
        },
      ),
    );

    if (role === 'role not found') {
      throw new NotFoundException('role not found');
    }

    if (!role) {
      throw new BadRequestException('role already exists');
    }

    return role;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Role')
  @ApiOperation({ summary: 'delete role' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('roles/:value')
  async deleteRole(@Param('value') value: string): Promise<void> {
    const role = await firstValueFrom(
      this.rolesService.send(
        {
          cmd: 'delete_role',
        },

        value,
      ),
    );

    if (!role) {
      throw new NotFoundException('role not found');
    }

    return;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Role')
  @ApiOperation({ summary: 'create user role' })
  @ApiResponse({ status: HttpStatus.CREATED, schema: schemaUserRole })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @Post('user/role')
  async addRoleToUser(@Body() userRole: CreateUserRoleDto): Promise<UserRole> {
    const roleToUser = await firstValueFrom(
      this.rolesService.send(
        {
          cmd: 'create_user_role',
        },
        userRole,
      ),
    );

    if (!roleToUser) {
      throw new BadRequestException('role to user already exists');
    }

    if (roleToUser === 'data not correct') {
      throw new BadRequestException('data not correct');
    }

    return roleToUser;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Role')
  @ApiOperation({ summary: 'delete user role' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('user/role')
  async deleteRoleToUser(@Body() userRole: CreateUserRoleDto): Promise<void> {
    const roleToUser = await firstValueFrom(
      this.rolesService.send(
        {
          cmd: 'delete_user_role',
        },
        userRole,
      ),
    );

    if (!roleToUser) {
      throw new BadRequestException('role to user not found');
    }

    return;
  }

  // FILM ENDPOINTS -------------------------------------------------------------

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Film')
  @ApiOperation({ summary: 'created film' })
  @ApiResponse({ status: HttpStatus.CREATED, schema: schemaFilm })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
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
      throw new BadRequestException('film is already exists');
    }

    return newFilm;
  }

  @ApiTags('Film')
  @ApiOperation({ summary: 'get all films' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaFilm },
  })
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
  @ApiOperation({ summary: 'get film by id' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaFilm })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
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
      throw new NotFoundException('film not found');
    }

    return film;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Film')
  @ApiOperation({ summary: 'update film name' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaFilm })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
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
      throw new NotFoundException('film not found');
    }

    return updateFilm;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Film')
  @ApiOperation({ summary: 'delete film' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('films/:film_id')
  async deleteFilm(@Param('film_id') film_id: string): Promise<void> {
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
      throw new NotFoundException('film not found');
    }

    return;
  }

  @ApiTags('Film')
  @ApiOperation({ summary: 'get films by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaFilm },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
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
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaFilm },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaFilm },
  })
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
  // COUNTRIES ENDPOINTS -------------------------------------------------------------

  @ApiTags('Country')
  @ApiOperation({ summary: 'get all countries' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaCountry },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaCountry },
  })
  @Get('name/countries')
  async getCountriesByName(@Query('country') country: CountriesNameQueryDto) {
    const countries = await firstValueFrom(
      this.filmService.send(
        {
          cmd: 'get_countries_by_name',
        },

        country,
      ),
    );

    return countries;
  }

  // GENRES ENDPOINTS -------------------------------------------------------------

  @ApiTags('Genre')
  @ApiOperation({ summary: 'get all genres' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaGenre },
  })
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

  @ApiTags('Genre')
  @ApiOperation({ summary: 'get genre by id' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaGenre })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
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
      throw new NotFoundException('genre not found');
    }

    return genre;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Genre')
  @ApiOperation({ summary: 'update genre name' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaGenre })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
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
      throw new NotFoundException('genre not found');
    }

    return updateGenre;
  }

  // PERSON ENDPOINTS -------------------------------------------------------------

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiTags('Person')
  @ApiOperation({ summary: 'created persons from film' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: { type: 'array', items: schemaPerson },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, schema: schemaError })
  @Post('persons')
  async addPersonsFromFilm(@Body() persons: CreatePersonsFilmDto) {
    return this.personService.send(
      {
        cmd: 'add_person',
      },

      persons,
    );
  }

  @ApiTags('Person')
  @ApiOperation({ summary: 'get all persons' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaPerson },
  })
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
  @ApiOperation({ summary: 'get person by id' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaPerson })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
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
      throw new NotFoundException('person not found');
    }

    return person;
  }

  @ApiTags('Person')
  @ApiOperation({ summary: 'get persons from film' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaPerson },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
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
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaPerson },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
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

  // COMMENT ENDPOINTS -------------------------------------------------------------

  @UseGuards(AuthGuard)
  @ApiTags('Comment')
  @ApiOperation({ summary: 'create comment to film' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: schemaComment,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
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

    if (comment === 'user id is not uuid') {
      throw new BadRequestException('user id is not uuid');
    }

    if (comment === 'user not found') {
      throw new BadRequestException('user not found');
    }

    if (comment === 'parent comment id is not uuid') {
      throw new BadRequestException('parent comment id is not uuid');
    }

    if (!comment) {
      throw new BadRequestException('parent comment not found');
    }

    return comment;
  }

  @ApiTags('Comment')
  @ApiOperation({ summary: 'get all comments of film' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: schemaComment },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
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
  @ApiResponse({ status: HttpStatus.OK, schema: schemaComment })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
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
      throw new NotFoundException('comment not found');
    }

    return comment;
  }

  @UseGuards(AuthGuard)
  @ApiTags('Comment')
  @ApiOperation({ summary: 'update comment' })
  @ApiResponse({ status: HttpStatus.OK, schema: schemaComment })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @HttpCode(HttpStatus.OK)
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
      throw new NotFoundException('comment not found');
    }

    return comment;
  }

  @UseGuards(AuthGuard)
  @ApiTags('Comment')
  @ApiOperation({ summary: 'delete comment' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: schemaError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, schema: schemaError })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, schema: schemaError })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('comments/:comment_id')
  async deleteComment(@Param('comment_id') comment_id: string): Promise<void> {
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
      throw new NotFoundException('comment not found');
    }

    return;
  }
}
