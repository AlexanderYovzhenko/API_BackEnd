import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { FilmPerson, FilmRole, Person, PersonFilmRole } from './entities';
import { ICreatePerson } from './interface/interfaces';

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
          attributes: ['film_role_id', 'film_role'],
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

  async getPersonsFromFilm(film_id: string) {
    const personsFromFilm = await this.personRepository.findAll({
      include: [
        {
          model: FilmRole,
          attributes: ['film_role_id', 'film_role'],
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

    // return personsFromFilm;
    return personsFromFilm.filter((person) =>
      person.films.map((film) => film.film_id).includes(film_id),
    );
  }

  async getFilmsByPerson(actor: {
    first_name_ru: string;
    last_name_ru: string;
    film_role: string;
  }) {
    const { first_name_ru, last_name_ru, film_role } = actor;

    const person = await this.personRepository.findOne({
      where: { first_name_ru, last_name_ru },
      include: [
        {
          model: FilmRole,
          where: { film_role },
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
    // console.log(person.films);

    return person;
  }

  async addPersonsFromFilm(persons: ICreatePerson[], film_id: string) {
    persons.forEach(async (person) => {
      const {
        film_role,
        first_name_ru,
        last_name_ru,
        first_name_en,
        last_name_en,
        description,
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
          description,
          img,
        },
      });

      const { person_id } = checkPerson[0];

      const checkFilmRole = await this.filmRoleRepository.findOrCreate({
        where: { film_role: film_role.toLowerCase() },
        defaults: {
          film_role_id: this.generateUUID(),
          film_role: film_role.toLocaleLowerCase(),
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

    return film_id;
  }
}
