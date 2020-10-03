import { CommandBus, EventBus, EventPublisher } from "@nestjs/cqrs";
import { Provider } from "@nestjs/common";

import { IEvent } from "@nestjs/cqrs";
import { RuntimeRepository } from 'src/config/runtime-repository';

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

export const TestEnvironment = () => [
  TestEventBus(),
  TestCommandBus(),
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