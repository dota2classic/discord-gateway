import { CreateQueueMessageHandler } from 'queue/command/CreateQueueMessage/create-queue-message.handler';
import { QueueMessageSyncRepository } from 'queue/repository/queue-message-sync.repository';
import { QueueStateHandler } from 'queue/query/GatewayQueueState/queue-state.handler';
import { LoadQueueMessageHandler } from 'queue/command/LoadQueueMessage/load-queue-message.handler';
import { QueueSaga } from 'queue/saga/queue.saga';
import { PlayerEnterQueueHandler } from 'queue/command/PlayerEnterQueue/player-enter-queue.handler';
import { DeleteQueueMessageHandler } from 'queue/command/DeleteQueueMessage/delete-queue-message.handler';
import { PlayerLeaveQueueHandler } from 'queue/command/PlayerLeaveQueue/player-leave-queue.handler';
import { I18nService } from '../discord/service/i18n.service';
import { GetByConnectionHandler } from './query/GetByConnection/get-by-connection.handler';
import { GetAllConnectionsHandler } from './query/GetAllConnections/get-all-connections.handler';

const CommandHandlers = [
  CreateQueueMessageHandler,
  LoadQueueMessageHandler,
  DeleteQueueMessageHandler,

  // gateway
  QueueStateHandler,
  PlayerEnterQueueHandler,
  PlayerLeaveQueueHandler,
];

const QueryHandlers = [
  QueueStateHandler,
  GetAllConnectionsHandler,
  GetByConnectionHandler,
];
const Sagas = [QueueSaga];

export const QueueProviders = [
  ...CommandHandlers,
  ...QueryHandlers,
  ...Sagas,
  I18nService,
  QueueMessageSyncRepository,
];
