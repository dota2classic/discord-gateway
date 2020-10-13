import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { clearRepositories, DiscordServiceMock, TestEnvironment } from '@test/cqrs';
import { ListenQueueMessageHandler } from 'discord/command/ListenQueueMessage/listen-queue-message.handler';
import { ListenQueueMessageCommand } from 'discord/command/ListenQueueMessage/listen-queue-message.command';
import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { DiscordService } from 'discord/service/discord.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueMessageModel } from 'queue/model/queue-message.model';
import { testDbConfig } from 'config/typeorm.config';
import { MockClient, MockGuild } from '@test/client-mock';

describe('ListenQueueMessageHandler', () => {
  let ebus: EventBus;
  let cbus: CommandBus;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testDbConfig),
        TypeOrmModule.forFeature([QueueMessageModel]),
      ],
      providers: [
        ...TestEnvironment(),
        ListenQueueMessageHandler,
        DiscordServiceMock,

        MockClient,
        MockGuild,
      ],
    }).compile();

    cbus = module.get<CommandBus>(CommandBus);
    ebus = module.get<EventBus>(EventBus);

    cbus.register([ListenQueueMessageHandler]);
  });

  afterEach(() => {
    clearRepositories();
  });

  it('should listen to reactions if there is a message', async () => {
    await cbus.execute(
      new ListenQueueMessageCommand(MatchmakingMode.SOLOMID, '1', '1'),
    );
    expect(module.get(DiscordService).listenReactions).toBeCalledTimes(1);
    expect(module.get(DiscordService).listenReactions).toBeCalledWith(
      '1',
      '1',
      MatchmakingMode.SOLOMID,
    );
  });
});
