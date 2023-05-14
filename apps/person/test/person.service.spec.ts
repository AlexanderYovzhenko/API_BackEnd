import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { PersonService } from '../src/person.service';
import { FilmPerson, FilmRole, Person, PersonFilmRole } from '../src/entities';
import { personStub } from './stubs/person.stub';
import {
  mockFilmPersonRepository,
  mockFilmRoleRepository,
  mockPersonFilmRoleRepository,
  mockPersonRepository,
} from './mocks';
import { filmRoleStub } from './stubs/filmRole.stub';

describe('PersonService', () => {
  let personService: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getModelToken(Person),
          useValue: mockPersonRepository,
        },
        {
          provide: getModelToken(FilmPerson),
          useValue: mockFilmPersonRepository,
        },
        {
          provide: getModelToken(FilmRole),
          useValue: mockFilmRoleRepository,
        },
        {
          provide: getModelToken(PersonFilmRole),
          useValue: mockPersonFilmRoleRepository,
        },
      ],
    }).compile();

    personService = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(personService).toBeDefined();
  });

  describe('getPerson', () => {
    it('should be defined', async () => {
      expect(
        await personService.getPerson(personStub().person_id),
      ).toBeDefined();
    });

    it('should be return person by id', async () => {
      expect(await personService.getPerson(personStub().person_id)).toEqual({
        person_id: expect.any(String),
        ...personStub(),
      });
    });

    it('should be return null', async () => {
      expect(await personService.getPerson('123')).toEqual(null);
    });
  });

  describe('getAllPersons', () => {
    it('should be defined', async () => {
      expect(await personService.getAllPersons({ limit: '1' })).toBeDefined();
    });

    it('should be return array persons', async () => {
      expect(await personService.getAllPersons({ limit: '1' })).toEqual([
        {
          person_id: expect.any(String),
          ...personStub(),
        },
      ]);
    });
  });

  describe('getPersonsFromFilm', () => {
    it('should be defined', async () => {
      expect(
        await personService.getPersonsFromFilm(personStub().films[0].film_id),
      ).toBeDefined();
    });

    it('should be return array persons from film', async () => {
      expect(
        await personService.getPersonsFromFilm(personStub().films[0].film_id),
      ).toEqual([
        {
          person_id: expect.any(String),
          ...personStub(),
        },
      ]);
    });

    it('should be return empty array', async () => {
      expect(await personService.getPersonsFromFilm('123')).toEqual([]);
    });
  });

  describe('getPersonsByName', () => {
    it('should be defined', async () => {
      expect(
        await personService.getPersonsByName({
          first_name: 'Alex',
          last_name: 'Bar',
          film_role: 'actor',
        }),
      ).toBeDefined();
    });

    it('should be return array persons by name', async () => {
      expect(
        await personService.getPersonsByName({
          first_name: 'Alex',
          last_name: 'Bar',
          film_role: 'actor',
        }),
      ).toEqual([
        {
          person_id: expect.any(String),
          ...personStub(),
        },
      ]);
    });
  });

  describe('getFilmsByPerson', () => {
    it('should be defined', async () => {
      expect(
        await personService.getFilmsByPerson({
          first_name: 'Alex',
          last_name: 'Bar',
          film_role: 'actor',
        }),
      ).toBeDefined();
    });

    it('should be return array films by person', async () => {
      expect(
        await personService.getFilmsByPerson({
          first_name: 'Alex',
          last_name: 'Bar',
          film_role: 'actor',
        }),
      ).toEqual({
        person_id: expect.any(String),
        ...personStub(),
      });
    });
  });

  describe('addPersonsFromFilm', () => {
    it('should be defined', async () => {
      expect(
        await personService.addPersonsFromFilm(
          [
            {
              ...filmRoleStub(),
              ...personStub(),
            },
          ],
          personStub().films[0].film_id,
        ),
      ).toBeDefined();
    });

    it('should be return empty array', async () => {
      expect(
        await personService.addPersonsFromFilm(
          [
            {
              ...filmRoleStub(),
              ...personStub(),
            },
          ],
          '123',
        ),
      ).toEqual([]);
    });

    it('should be return array persons by film', async () => {
      expect(
        await personService.addPersonsFromFilm(
          [
            {
              ...filmRoleStub(),
              ...personStub(),
            },
          ],
          personStub().films[0].film_id,
        ),
      ).toEqual([
        {
          person_id: expect.any(String),
          ...personStub(),
        },
      ]);
    });
  });
});
