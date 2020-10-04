import { CommandsSaga } from 'discord/saga/commands.saga';
import { DiscordSaga } from 'discord/saga/discord.saga';
import { ListenQueueMessageHandler } from 'discord/command/ListenQueueMessage/listen-queue-message.handler';
import { EmojiService } from 'discord/emoji.service';

const Sagas = [
  CommandsSaga,
  DiscordSaga
]

const CommandHandlers = [
  ListenQueueMessageHandler
]
export const DiscordProviders = [
  ...CommandHandlers,
  ...Sagas,
  EmojiService,
]