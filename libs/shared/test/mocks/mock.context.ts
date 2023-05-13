import { RmqContext } from '@nestjs/microservices';

export const mockChannel = { ack: jest.fn() };

export const mockMessage = { content: 'test message' };

export const mockRmqContext = {
  getChannelRef: () => mockChannel,
  getMessage: () => mockMessage,
} as unknown as RmqContext;
