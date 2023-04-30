import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { FilmPerson, FilmRole, Person, PersonFilmRole } from './entities';
import {
  ICreatePerson,
  IShortPerson,
} from './interface/person-service.interfaces';

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person) private personRepository: Repository<Person>,
    @InjectModel(FilmPerson)
    private filmPersonRepository: Repository<FilmPerson>,
    @InjectModel(FilmRole) private filmRoleRepository: Repository<FilmRole>,
    @InjectModel(PersonFilmRole)
    private personFilmRoleRepository: Repository<PersonFilmRole>,
  ) {}

  generateUUID(): string {
    return uuid();
  }

  async getPerson(person_id: string) {
    const person = await this.personRepository.findOne({
      where: { person_id },
      include: [
        {
          model: FilmRole,
          attributes: ['film_role_id', 'film_role', 'slug'],
          through: {
            attributes: [],
          },
        },
        {
          model: FilmPerson,
          attributes: ['film_id'],
        },
      ],
    });

    if (!person) {
      return null;
    }

    return person;
  }

  async getAllPersons(queryLimit: { limit: string }) {
    const { limit } = queryLimit;

    const persons = await this.personRepository.findAll({
      include: [
        {
          model: FilmRole,
          attributes: ['film_role_id', 'film_role', 'slug'],
          through: {
            attributes: [],
          },
        },
        {
          model: FilmPerson,
          attributes: ['film_id'],
        },
      ],
      limit: limit ? +limit : 100,
    });

    return persons;
  }

  async getPersonsFromFilm(film_id: string) {
    const personsFromFilm = await this.personRepository.findAll({
      include: [
        {
          model: FilmRole,
          attributes: ['film_role_id', 'film_role', 'slug'],
          through: {
            attributes: [],
          },
        },
        {
          model: FilmPerson,
          // where: { film_id },
          attributes: ['film_id'],
        },
      ],
    });

    // добавляем количество фильмов у персонажа, если делать через where нет количества фильмов
    return personsFromFilm.filter((person) =>
      person.films.map((film) => film.film_id).includes(film_id),
    );
  }

  async getPersonsWhoFits(person: IShortPerson) {
    const { first_name, last_name, film_role } = person;

    const personsFits = await this.personRepository.findAll({
      where: {
        [Op.or]: [
          { first_name_ru: { [Op.substring]: first_name } },
          { last_name_ru: { [Op.substring]: last_name } },
          { first_name_en: { [Op.substring]: first_name } },
          { last_name_en: { [Op.substring]: last_name } },
        ],
      },
      include: [
        {
          model: FilmRole,
          where: { [Op.or]: [{ film_role }, { slug: film_role }] },
          attributes: ['film_role_id', 'film_role', 'slug'],
          through: {
            attributes: [],
          },
        },
        {
          model: FilmPerson,
          attributes: ['film_id'],
        },
      ],
    });

    return personsFits;
  }

  async getFilmsByPerson(person: IShortPerson) {
    const { first_name, last_name, film_role } = person;

    const filmsPerson = await this.personRepository.findOne({
      where: {
        [Op.or]: [
          { first_name_ru: first_name, last_name_ru: last_name },
          { first_name_en: first_name, last_name_en: last_name },
        ],
      },
      include: [
        {
          model: FilmRole,
          where: { film_role: film_role.toLocaleLowerCase() },
          attributes: [],
          through: {
            attributes: [],
          },
        },
        {
          model: FilmPerson,
          attributes: ['film_id'],
        },
      ],
    });

    return filmsPerson;
  }

  async addPersonsFromFilm(persons: ICreatePerson[], film_id: string) {
    persons.forEach(async (person) => {
      const {
        film_role,
        film_role_slug,
        first_name_ru,
        last_name_ru,
        first_name_en,
        last_name_en,
        img,
      } = person;

      const checkPerson = await this.personRepository.findOrCreate({
        where: { first_name_ru, last_name_ru },
        defaults: {
          person_id: this.generateUUID(),
          first_name_ru,
          last_name_ru,
          first_name_en,
          last_name_en,
          img,
        },
      });

      const { person_id } = checkPerson[0];

      const checkFilmRole = await this.filmRoleRepository.findOrCreate({
        where: { film_role: film_role.toLowerCase() },
        defaults: {
          film_role_id: this.generateUUID(),
          film_role: film_role.toLocaleLowerCase(),
          slug: film_role_slug.toLocaleLowerCase(),
        },
      });

      const { film_role_id } = checkFilmRole[0];

      await this.personFilmRoleRepository.findOrCreate({
        where: { person_id, film_role_id },
        defaults: {
          person_film_role_id: this.generateUUID(),
          person_id,
          film_role_id,
        },
      });

      await this.filmPersonRepository.findOrCreate({
        where: { film_id },
        include: [
          {
            model: Person,
            where: { person_id },
          },
        ],
        defaults: {
          film_person_id: this.generateUUID(),
          film_id,
          person_id,
        },
      });
    });

    return {
      film_id,
    };
  }
}
