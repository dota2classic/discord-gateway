import { CommandBus, EventBus, EventPublisher, IEvent, QueryBus } from '@nestjs/cqrs';
import { Provider } from '@nestjs/common';
import { RuntimeRepository } from 'config/runtime-repository';
import { MockClient } from '@test/client-mock';
import { Client } from 'discord.js';

const ebusProvider: Provider = {
  provide: EventBus,
  useFactory: () => ({
    publish: jest.fn(),
  }),
};

const TestEventBus = () => ebusProvider;

const TestCommandBus = () => ({
  provide: CommandBus,
  useClass: CommandBus,
});

const TestQueryBus = () => ({
  provide: QueryBus,
  useFactory: () => ({
    execute: jest.fn(),
  }),
});

export const TestEnvironment = () => [
  TestEventBus(),
  TestCommandBus(),
  TestQueryBus(),
  EventPublisher,
];

export function clearRepositories() {
  // @ts-ignore
  RuntimeRepository.clearAll();
}

declare global {
  namespace jest {
    // noinspection JSUnusedGlobalSymbols
    interface Matchers<R> {
      toEmit(...events: IEvent[]): CustomMatcherResult;
      toEmitNothing(): CustomMatcherResult;
    }
  }
}
