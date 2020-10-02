import { SyncQueueMessageHandler } from 'src/queue/command/SyncQueueMessage/sync-queue-message.handler';
import { CreateQueueMessageHandler } from 'src/queue/command/CreateQueueMessage/create-queue-message.handler';
import { QueueMessageSyncRepository } from 'src/queue/repository/queue-message-sync.repository';
import { Provider } from '@nestjs/common';

const CommandHandlers = [
  SyncQueueMessageHandler,
  CreateQueueMessageHandler
]


export const QueueProviders = [
  ...CommandHandlers,
  QueueMessageSyncRepository
]