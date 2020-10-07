import { CommandsSaga } from 'discord/saga/commands.saga';
import { DiscordSaga } from 'discord/saga/discord.saga';
import { ListenQueueMessageHandler } from 'discord/command/ListenQueueMessage/listen-queue-message.handler';
import { EmojiService } from 'discord/emoji.service';
import { QueueUpdatedHandler } from 'discord/event-handler/queue-updated.handler';
import { UpdateQueueMessageHandler } from 'discord/command/UpdateQueueMessage/update-queue-message.handler';
import { DiscordService } from 'discord/discord.service';

const Sagas = [CommandsSaga, DiscordSaga];
const EventHandlers = [QueueUpdatedHandler];

const CommandHandlers = [ListenQueueMessageHandler, UpdateQueueMessageHandler];
export const DiscordProviders = [
  ...CommandHandlers,
  ...Sagas,
  ...EventHandlers,
  EmojiService,
  DiscordService
];
