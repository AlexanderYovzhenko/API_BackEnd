import { Test, TestingModule } from '@nestjs/testing';
import { SharedService } from '../src/services/shared.service';
import { ConfigService } from '@nestjs/config';
import { mockChannel, mockMessage, mockRmqContext } from './mocks';
import { Transport } from '@nestjs/microservices';

describe('SharedService', () => {
  let sharedService: SharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    sharedService = module.get<SharedService>(SharedService);
  });

  it('should be defined', () => {
    expect(sharedService).toBeDefined();
  });

  describe('getRmqOptions', () => {
    it('should be defined', async () => {
      expect(sharedService.getRmqOptions('authStub')).toBeDefined();
    });

    it('should return RMQ options', () => {
      const mockConfigService = {
        get: jest.fn().mockImplementation((key: string) => {
          switch (key) {
            case 'RABBITMQ_USER':
              return 'username';
            case 'RABBITMQ_PASS':
              return 'password';
            case 'RABBITMQ_HOST':
              return 'localhost';
            case 'RABBITMQ_PORT':
              return '5672';
          }
        }),
      };

      const queueName = 'test_queue';
      const sharedService = new SharedService(mockConfigService as any);
      const rmqOptions = sharedService.getRmqOptions(queueName);

      expect(mockConfigService.get).toHaveBeenCalledTimes(4);
      expect(rmqOptions).toEqual({
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://username:password@localhost:5672`],
          noAck: false,
          queue: queueName,
          queueOptions: {
            durable: true,
          },
        },
      });
    });
  });

  describe('acknowledgeMessage', () => {
    it('should be defined', async () => {
      sharedService.acknowledgeMessage(mockRmqContext);

      expect(mockChannel.ack).toBeDefined();
    });

    it('should acknowledge message', () => {
      sharedService.acknowledgeMessage(mockRmqContext);

      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });
  });
});
