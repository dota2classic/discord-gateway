import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { clearRepositories, TestEnvironment } from '@test/cqrs';
import { CreateQueueMessageHandler } from 'queue/command/CreateQueueMessage/create-queue-message.handler';
import { CreateQueueMessageCommand } from 'queue/command/CreateQueueMessage/create-queue-message.command';
import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from 'config/typeorm.config';
import { QueueMessageModel } from 'queue/model/queue-message.model';
import { QueueMessageSyncRepository } from 'queue/repository/queue-message-sync.repository';
import { MockClient } from '@test/client-mock';
import { QueueMessageCreatedEvent } from 'queue/event/queue-message-created.event';


jest.mock("discord.js");

describe('CreateQueueMessageHandler', () => {
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
        CreateQueueMessageHandler,
        QueueMessageSyncRepository,
        MockClient,
        ...TestEnvironment(),
      ],
    }).compile();

    cbus = module.get<CommandBus>(CommandBus);
    ebus = module.get<EventBus>(EventBus);

    cbus.register([CreateQueueMessageHandler]);
  });

  afterEach(() => {
    clearRepositories();
  });

  it('should create q message if not created', async () => {
    await cbus.execute(
      new CreateQueueMessageCommand(MatchmakingMode.SOLOMID, '1234'),
    );
    expect(ebus).toEmit(new QueueMessageCreatedEvent(MatchmakingMode.SOLOMID, '1234', 'testid'))
  });
});
