import { Test, TestingModule } from "@nestjs/testing";
import { CommandBus, EventBus, EventPublisher } from "@nestjs/cqrs";
import { TestEnvironment, clearRepositories } from "src/@test/cqrs";
import { CreateQueueMessageHandler } from 'src/queue/command/CreateQueueMessage/create-queue-message.handler';
import { QueueProviders } from 'src/queue/index';


describe('CreateQueueMessageHandler', () => {
  let ebus: EventBus;
  let cbus: CommandBus;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ...QueueProviders,
        ...TestEnvironment()
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

  });
});
