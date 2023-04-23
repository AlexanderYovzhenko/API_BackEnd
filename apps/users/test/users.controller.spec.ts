import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/users.controller';
import { UsersService } from '../src/users.service';
import { ValidationPipe } from '../pipes/validation.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUserDto';

describe('UsersController', () => {
  let controller: UsersController;
  let pipe: ValidationPipe;
  const mockUserService = {
    //fake implementantion
    createUser: jest.fn((dto) => {
      return {
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
    pipe = new ValidationPipe();
  });

  it('user controller is defined', () => {
    expect(controller).toBeDefined();
  });

  it('create user', () => {
    const dto = {
      email: 'test',
      password: 'test',
    };

    expect(controller.createUser(dto)).toEqual({
      email: 'test',
      password: 'test',
    });
  });

  it('validation pipe is defined', () => {
    expect(pipe).toBeDefined();
  });

  it('validation error empty data', async () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateUserDto,
      data: '',
    };

    const value = () => pipe.transform(<CreateUserDto>{}, metadata);
    await value().catch((err) => {
      expect(err.status).toEqual(400);
    });
  });

  it('validation email error', async () => {
    const wrongData = {
      email: 'test',
      password: '123456',
    };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateUserDto,
      data: '',
    };

    const value = () => pipe.transform(wrongData, metadata);
    await value().catch((err) => {
      expect(err.status).toEqual(400);
    });
  });

  it('validation passing', async () => {
    const data = {
      //ВЫНЕСТИ В ФИКСТУРЫ
      email: 'test@test.com',
      password: '123456',
    };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateUserDto,
      data: '',
    };

    const value = () => pipe.transform(data, metadata);
    const result = await value();
    expect(result).toStrictEqual({
      email: 'test@test.com',
      password: '123456',
    });
  });
});
