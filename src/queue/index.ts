import { SyncQueueMessageHandler } from 'queue/command/SyncQueueMessage/sync-queue-message.handler';
import { CreateQueueMessageHandler } from 'queue/command/CreateQueueMessage/create-queue-message.handler';
import { QueueMessageSyncRepository } from 'queue/repository/queue-message-sync.repository';
import { QueueStateHandler } from 'queue/query/GatewayQueueState/queue-state.handler';
import { QueueUpdatedHandler } from 'queue/event-handler/queue-updated.handler';

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
