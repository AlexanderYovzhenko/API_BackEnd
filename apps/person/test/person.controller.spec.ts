import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from '../src/person.controller';
import { PersonService } from '../src/person.service';
import { SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { personStub } from './stubs/person.stub';
import { RmqContext } from '@nestjs/microservices';
import { context, mockPersonService, mockSharedService } from './mocks';
import { filmRoleStub } from './stubs/filmRole.stub';

describe('PersonController', () => {
  let personController: PersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        PersonService,
        {
          provide: PersonService,
          useValue: mockPersonService,
        },
        {
          provide: 'SharedServiceInterface',
          useClass: SharedService,
        },
        {
          provide: SharedService,
          useValue: mockSharedService,
        },
        {
          provide: ConfigService,
          useValue: {
            get(): string {
              return 'mock-value';
            },
          },
        },
      ],
    }).compile();

    personController = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(personController).toBeDefined();
  });

  describe('getPerson', () => {
    it('should be defined', async () => {
      return expect(
        await personController.getPerson(
          context as RmqContext,
          personStub().person_id,
        ),
      ).toBeDefined();
    });

    it('should return a person', async () => {
      const result = await personController.getPerson(
        context as RmqContext,
        personStub().person_id,
      );

      expect(result).toEqual(personStub());
    });
  });

  describe('getAllPersons', () => {
    it('should be defined', async () => {
      return expect(
        await personController.getAllPersons(context as RmqContext, {
          limit: '1',
        }),
      ).toBeDefined();
    });

    it('should return array persons', async () => {
      const result = await personController.getAllPersons(
        context as RmqContext,
        { limit: '1' },
      );

      expect(result).toEqual([personStub()]);
    });
  });

  describe('getPersonsFromFilm', () => {
    it('should be defined', async () => {
      return expect(
        await personController.getPersonsFromFilm(
          context as RmqContext,
          personStub().films[0].film_id,
        ),
      ).toBeDefined();
    });

    it('should return array persons from film', async () => {
      const result = await personController.getPersonsFromFilm(
        context as RmqContext,
        personStub().films[0].film_id,
      );

      expect(result).toEqual([personStub()]);
    });
  });

  describe('getPersonsByName', () => {
    it('should be defined', async () => {
      return expect(
        await personController.getPersonsByName(context as RmqContext, {
          first_name: 'Alex',
          last_name: 'Bar',
          film_role: 'actor',
        }),
      ).toBeDefined();
    });

    it('should return array persons by name', async () => {
      const result = await personController.getPersonsByName(
        context as RmqContext,
        {
          first_name: 'Alex',
          last_name: 'Bar',
          film_role: 'actor',
        },
      );

      expect(result).toEqual([personStub()]);
    });
  });

  describe('getFilmsByPerson', () => {
    it('should be defined', async () => {
      return expect(
        await personController.getFilmsByPerson(context as RmqContext, {
          first_name: 'Alex',
          last_name: 'Bar',
          film_role: 'actor',
        }),
      ).toBeDefined();
    });

    it('should return films by person', async () => {
      const result = await personController.getFilmsByPerson(
        context as RmqContext,
        {
          first_name: 'Alex',
          last_name: 'Bar',
          film_role: 'actor',
        },
      );

      expect(result).toEqual(personStub());
    });
  });

  describe('addPersonsFromFilm', () => {
    it('should be defined', async () => {
      return expect(
        await personController.addPersonsFromFilm(context as RmqContext, {
          persons: [
            {
              ...filmRoleStub(),
              ...personStub(),
            },
          ],
          film_id: personStub().films[0].film_id,
        }),
      ).toBeDefined();
    });

    it('should return array add persons', async () => {
      const result = await personController.addPersonsFromFilm(
        context as RmqContext,
        {
          persons: [
            {
              ...filmRoleStub(),
              ...personStub(),
            },
          ],
          film_id: personStub().films[0].film_id,
        },
      );

      expect(result).toEqual([personStub()]);
    });
  });
});
