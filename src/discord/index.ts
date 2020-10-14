import {CommandsSaga} from 'discord/saga/commands.saga';
import {DiscordSaga} from 'discord/saga/discord.saga';
import {ListenQueueMessageHandler} from 'discord/command/ListenQueueMessage/listen-queue-message.handler';
import {EmojiService} from 'discord/service/emoji.service';
import {QueueUpdatedHandler} from 'discord/event-handler/queue-updated.handler';
import {UpdateQueueMessageHandler} from 'discord/command/UpdateQueueMessage/update-queue-message.handler';
import {DiscordService} from 'discord/service/discord.service';
import {DeliverReadyCheckHandler} from './command/DeliverReadyCheck/deliver-ready-check.handler';
import {ReadyCheckRepository} from './repository/ready-check.repository';
import {ReadyCheckStartedHandler} from './event-handler/ready-check-started.handler';
import {ReadyCheckService} from './service/ready-check.service';
import {ReadyStateUpdatedHandler} from './event-handler/ready-state-updated.handler';
import {DiscordUserRepository} from "./repository/discord-user.repository";
import {DiscordEnterQueueHandler} from "./event-handler/discord-enter-queue.handler";
import {DiscordLeaveQueueHandler} from "./event-handler/discord-leave-queue.handler";

const Sagas = [CommandsSaga, DiscordSaga];
const EventHandlers = [
  QueueUpdatedHandler,
  ReadyStateUpdatedHandler,
  ReadyCheckStartedHandler,
  DiscordEnterQueueHandler,
  DiscordLeaveQueueHandler
];
const Repositories = [ReadyCheckRepository, DiscordUserRepository];

const CommandHandlers = [
  ListenQueueMessageHandler,
  UpdateQueueMessageHandler,
  DeliverReadyCheckHandler,
];
export const DiscordProviders = [
  ...CommandHandlers,
  ...Sagas,
  ...EventHandlers,
  ...Repositories,
  EmojiService,
  ReadyCheckService,
  DiscordService,
];
