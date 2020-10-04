import { CreateQueueMessageHandler } from 'queue/command/CreateQueueMessage/create-queue-message.handler';
import { QueueMessageSyncRepository } from 'queue/repository/queue-message-sync.repository';
import { QueueStateHandler } from 'queue/query/GatewayQueueState/queue-state.handler';
import { QueueUpdatedHandler } from 'queue/event-handler/queue-updated.handler';
import { LoadQueueMessageHandler } from 'queue/command/LoadQueueMessage/load-queue-message.handler';
import { QueueSaga } from 'queue/saga/queue.saga';
import { Saga } from '@nestjs/cqrs';
import { PlayerEnterQueueCommand } from 'gateway/commands/player-enter-queue.command';
import { PlayerEnterQueueHandler } from 'queue/command/PlayerEnterQueue/player-enter-queue.handler';

const CommandHandlers = [
  CreateQueueMessageHandler,
  LoadQueueMessageHandler,

  // gateway
  QueueStateHandler,
  PlayerEnterQueueHandler
];

const EventHandlers = [QueueUpdatedHandler];
const QueryHandlers = [QueueStateHandler];
const Sagas = [QueueSaga];

export const QueueProviders = [
  ...CommandHandlers,
  ...EventHandlers,
  ...QueryHandlers,
  ...Sagas,
  QueueMessageSyncRepository,
];
