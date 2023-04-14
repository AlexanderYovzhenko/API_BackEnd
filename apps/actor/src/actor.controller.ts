import { Controller, Get } from '@nestjs/common';
import { ActorService } from './actor.service';

@Controller()
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get()
  getHello(): string {
    return this.actorService.getHello();
  }
}
