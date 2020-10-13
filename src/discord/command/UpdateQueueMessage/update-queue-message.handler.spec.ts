import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { UpdateQueueMessageHandler } from 'discord/command/UpdateQueueMessage/update-queue-message.handler';
import {
  clearRepositories,
  DiscordServiceMock,
  TestEnvironment,
} from '@test/cqrs';
import { QueueMessageSyncRepository } from 'queue/repository/queue-message-sync.repository';
import { Guild } from 'discord.js';
import { UpdateQueueMessageCommand } from 'discord/command/UpdateQueueMessage/update-queue-message.command';
import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { DiscordService } from 'discord/service/discord.service';
import { QueueMessageSyncModel } from 'queue/model/queue-message-sync.model';
import Mock = jest.Mock;

describe('UpdateQueueMessageHandler', () => {
  let ebus: EventBus;
  let cbus: CommandBus;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UpdateQueueMessageHandler,
        ...TestEnvironment(),
        {
          provide: Guild,
          useValue: {},
        },
        QueueMessageSyncRepository,
        DiscordServiceMock,
      ],
    }).compile();

    cbus = module.get<CommandBus>(CommandBus);
    ebus = module.get<EventBus>(EventBus);

    cbus.register([UpdateQueueMessageHandler]);
  });

  afterEach(() => {
    clearRepositories();
  });

  it('should not update message  when no sync', async () => {
    await cbus.execute(
      new UpdateQueueMessageCommand(MatchmakingMode.SOLOMID, []),
    );
    expect(
      module.get(DiscordService).updateQueueMessage as Mock,
    ).toBeCalledTimes(0);
  });

  it('should update message  when there is sync', async () => {
    (await module.get(QueueMessageSyncRepository)).save(
      MatchmakingMode.SOLOMID,
      new QueueMessageSyncModel(MatchmakingMode.SOLOMID, '1', '1'),
    );
    await cbus.execute(
      new UpdateQueueMessageCommand(MatchmakingMode.SOLOMID, []),
    );
    expect(
      module.get(DiscordService).updateQueueMessage as Mock,
    ).toBeCalledTimes(1);
    expect(
      module.get(DiscordService).updateQueueMessage as Mock,
    ).toBeCalledWith('1', '1', MatchmakingMode.SOLOMID, []);
  });
});
