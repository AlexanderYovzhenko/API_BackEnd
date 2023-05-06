// import { Test } from '@nestjs/testing';
// import { PersonService } from '../src/person.service';
// import { FilmPerson, FilmRole, Person, PersonFilmRole } from '../src/entities';
// import { Repository } from 'sequelize-typescript';
// import { PersonModule } from '../src/person.module'; // Import the module containing PersonRepository

// describe('PersonService', () => {
//   let service: PersonService;
//   let personRepository: Repository<Person>;
//   let filmPersonRepository: Repository<FilmPerson>;
//   let filmRoleRepository: Repository<FilmRole>;
//   let personFilmRoleRepository: Repository<PersonFilmRole>;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       // imports: [PersonModule],
//       providers: [
//         PersonService,
//         {
//           provide: Person,
//           useValue: Person,
//         },
//         {
//           provide: FilmPerson,
//           useValue: FilmPerson,
//         },
//         {
//           provide: FilmRole,
//           useValue: FilmRole,
//         },
//         {
//           provide: PersonFilmRole,
//           useValue: PersonFilmRole,
//         },
//       ],
//     }).compile();

//     service = moduleRef.get<PersonService>(PersonService);
//     personRepository = moduleRef.get<Repository<Person>>(Person); // Use Repository here
//     filmPersonRepository = moduleRef.get<Repository<FilmPerson>>(FilmPerson);
//     filmRoleRepository = moduleRef.get<Repository<FilmRole>>(FilmRole);
//     personFilmRoleRepository =
//       moduleRef.get<Repository<PersonFilmRole>>(PersonFilmRole);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should call the findAll method of PersonRepository', async () => {
//     const persons = [
//       {
//         person_id: '1',
//         first_name_ru: 'John',
//         last_name_ru: 'Doe',
//         first_name_en: 'John',
//         last_name_en: 'Doe',
//         img: '',
//       },
//     ];

//     jest.spyOn(service, 'getAllPersons').mockResolvedValue(persons as Person[]);

//     const result = await service.getAllPersons({ limit: '5' });

//     expect(service.getAllPersons).toHaveBeenCalledTimes(1);
//     expect(result).toEqual(persons);
//   });

//   // Add other tests for the remaining service methods
// });
