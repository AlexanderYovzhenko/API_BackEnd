import { Controller, Inject } from '@nestjs/common';
import { PersonService } from './person.service';
import { SharedService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  ICreatePerson,
  IShortPerson,
} from './interface/person.service.interfaces';

@Controller()
export class PersonController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private readonly personService: PersonService,
  ) {}

  @MessagePattern({ cmd: 'get_person' })
  async getPerson(@Ctx() context: RmqContext, @Payload() person_id: string) {
    this.sharedService.acknowledgeMessage(context);

    return await this.personService.getPerson(person_id);
  }

  @MessagePattern({ cmd: 'get_all_persons' })
  async getAllPersons(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return await this.personService.getAllPersons();
  }

  @MessagePattern({ cmd: 'get_persons_from_film' })
  async getPersonsFromFilm(
    @Ctx() context: RmqContext,
    @Payload() film_id: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.personService.getPersonsFromFilm(film_id);
  }

  @MessagePattern({ cmd: 'get_persons_who_fits' })
  async getPersonsWhoFits(
    @Ctx() context: RmqContext,
    @Payload()
    person: IShortPerson,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.personService.getPersonsWhoFits(person);
  }

  @MessagePattern({ cmd: 'get_films_by_person' })
  async getFilmsByPerson(
    @Ctx() context: RmqContext,
    @Payload()
    person: IShortPerson,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.personService.getFilmsByPerson(person);
  }

  @MessagePattern({ cmd: 'add_person' })
  async addPersonsFromFilm(
    @Ctx() context: RmqContext,
    @Payload() data: { persons: ICreatePerson[]; film_id: string },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.personService.addPersonsFromFilm(
      data.persons,
      data.film_id,
    );
  }
}
