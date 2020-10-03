import { SyncQueueMessageHandler } from 'src/queue/command/SyncQueueMessage/sync-queue-message.handler';
import { CreateQueueMessageHandler } from 'src/queue/command/CreateQueueMessage/create-queue-message.handler';
import { QueueMessageSyncRepository } from 'src/queue/repository/queue-message-sync.repository';
import { QueueStateHandler } from 'src/queue/query/GatewayQueueState/queue-state.handler';
import { QueueUpdatedHandler } from 'src/queue/event-handler/queue-updated.handler';

const CommandHandlers = [SyncQueueMessageHandler, CreateQueueMessageHandler];

const EventHandlers = [
  QueueUpdatedHandler,
]
const QueryHandlers = [QueueStateHandler];

export const QueueProviders = [
  ...CommandHandlers,
  ...EventHandlers,
  ...QueryHandlers,
  QueueMessageSyncRepository,
];
