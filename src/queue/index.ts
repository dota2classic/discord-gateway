import { CreateQueueMessageHandler } from 'queue/command/CreateQueueMessage/create-queue-message.handler';
import { QueueMessageSyncRepository } from 'queue/repository/queue-message-sync.repository';
import { LoadQueueMessageHandler } from 'queue/command/LoadQueueMessage/load-queue-message.handler';
import { QueueSaga } from 'queue/saga/queue.saga';
import { PlayerEnterQueueHandler } from 'queue/command/PlayerEnterQueue/player-enter-queue.handler';
import { DeleteQueueMessageHandler } from 'queue/command/DeleteQueueMessage/delete-queue-message.handler';
import { PlayerLeaveQueueHandler } from 'queue/command/PlayerLeaveQueue/player-leave-queue.handler';
import { I18nService } from '../discord/service/i18n.service';
import { outerQuery } from '../gateway/util/outerQuery';
import { QueueStateQuery } from '../gateway/queries/QueueState/queue-state.query';
import { GetAllConnectionsQuery } from '../gateway/queries/GetAllConnections/get-all-connections.query';
import { GetByConnectionQuery } from '../gateway/queries/GetByConnection/get-by-connection.query';
import { GetUserInfoQuery } from "../gateway/queries/GetUserInfo/get-user-info.query";
import { GetPartyQuery } from "../gateway/queries/GetParty/get-party.query";
import { GetPlayerInfoQuery } from "../gateway/queries/GetPlayerInfo/get-player-info.query";
import { GetRoleSubscriptionsQuery } from "../gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query";

const CommandHandlers = [
  CreateQueueMessageHandler,
  LoadQueueMessageHandler,
  DeleteQueueMessageHandler,

  // gateway
  PlayerEnterQueueHandler,
  PlayerLeaveQueueHandler,
];

const QueryHandlers = [
  outerQuery(QueueStateQuery, 'QueryCore'),
  outerQuery(GetAllConnectionsQuery, 'QueryCore'),
  outerQuery(GetByConnectionQuery, 'QueryCore'),
  outerQuery(GetUserInfoQuery, 'QueryCore'),
  outerQuery(GetPartyQuery, 'QueryCore'),
  outerQuery(GetPlayerInfoQuery, 'QueryCore'),
  outerQuery(GetRoleSubscriptionsQuery, 'QueryCore'),

];
const Sagas = [QueueSaga];

export const QueueProviders = [
  ...CommandHandlers,
  ...QueryHandlers,
  ...Sagas,
  I18nService,
  QueueMessageSyncRepository,
];
