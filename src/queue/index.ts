import { SyncQueueMessageHandler } from 'src/queue/command/SyncQueueMessage/sync-queue-message.handler';
import { CreateQueueMessageHandler } from 'src/queue/command/CreateQueueMessage/create-queue-message.handler';
import { QueueMessageSyncRepository } from 'src/queue/repository/queue-message-sync.repository';
import { GatewayQueueStateHandler } from 'src/queue/query/GatewayQueueState/gateway-queue-state.handler';

const CommandHandlers = [SyncQueueMessageHandler, CreateQueueMessageHandler];

const QueryHandlers = [GatewayQueueStateHandler];

export const QueueProviders = [
  ...CommandHandlers,
  ...QueryHandlers,
  QueueMessageSyncRepository,
];
