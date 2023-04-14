import { Test, TestingModule } from '@nestjs/testing';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';

describe('ActorController', () => {
  let actorController: ActorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ActorController],
      providers: [ActorService],
    }).compile();

    actorController = app.get<ActorController>(ActorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(actorController.getHello()).toBe('Hello World!');
    });
  });
});
