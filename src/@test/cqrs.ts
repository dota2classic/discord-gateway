import { CommandBus, EventBus, EventPublisher, IEvent, QueryBus } from '@nestjs/cqrs';
import { Provider } from '@nestjs/common';
import { RuntimeRepository } from 'config/runtime-repository';
import { MockGuild } from '@test/client-mock';
import { Snowflake } from 'discord.js';
import { DiscordService } from 'discord/service/discord.service';
import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { QueueEntry } from 'discord/event/queue-update-received.event';
import {I18nService} from "../discord/service/i18n.service";

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
  MockGuild,
];

const mockMessage = {
  content: undefined,
};

export class DiscordServiceMockClass {

  constructor(private readonly i18nService: I18nService) {
  }
  getMessage = jest.fn(async (id: Snowflake, channelID: Snowflake) => {
    return mockMessage;
  });

  updateQueueMessage = jest.fn(
    async (
      id: Snowflake,
      channelId: Snowflake,
      mode: MatchmakingMode,
      entries: QueueEntry[],
    ) => {
      const msg = await this.getMessage(id, channelId);
      // msg.content = this.i18nService.queueMessage(mode, entries);
    },
  );

  listenReactions = jest.fn();
}

export const DiscordServiceMock = {
  provide: DiscordService,
  useClass: DiscordServiceMockClass,
};

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
