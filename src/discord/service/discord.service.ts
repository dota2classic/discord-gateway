import { Injectable, Logger } from '@nestjs/common';
import { Client, MessageReaction, Snowflake, TextChannel, User } from 'discord.js';
import { QueueEntry } from 'discord/event/queue-update-received.event';
import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { PlayerEnterQueueCommand } from 'gateway/commands/player-enter-queue.command';
import { PlayerLeaveQueueCommand } from 'gateway/commands/player-leave-queue.command';
import { EmojiService } from 'discord/service/emoji.service';
import { CommandBus } from '@nestjs/cqrs';
import {I18nService} from "./i18n.service";

@Injectable()
export class DiscordService {
  constructor(
    private readonly client: Client,
    private readonly emojiService: EmojiService,
    private readonly cbus: CommandBus,
    private readonly i18nService: I18nService
  ) {}

  private readonly logger = new Logger(DiscordService.name);

  public async getMessage(id: Snowflake, channelID: Snowflake) {
    const ch = (await this.client.channels.fetch(channelID)) as TextChannel;
    return await ch.messages.fetch(id);
  }

  public async updateQueueMessage(
    id: Snowflake,
    channelId: Snowflake,
    mode: MatchmakingMode,
    entries: QueueEntry[],
  ) {
    const msg = await this.getMessage(id, channelId);

    await msg.edit(this.i18nService.queueMessage(mode, entries));
  }

  public async listenReactions(
    messageID: Snowflake,
    channelID: Snowflake,
    mode: MatchmakingMode,
  ) {
    const msg = await this.getMessage(messageID, channelID);
    const qEmoji = await this.emojiService.getQueueEmoji();
    const deqEmoji = await this.emojiService.getDequeueEmoji();
    await msg.react(qEmoji);
    await msg.react(deqEmoji);

    const filter = (reaction: MessageReaction, user: User) => {
      return (
        // equal to play moji
        (qEmoji.id === reaction.emoji.id ||
          deqEmoji.id === reaction.emoji.id) &&
        user.id !== reaction.message.author.id
      );
    };

    const collector = msg.createReactionCollector(filter, {
      dispose: true,
    });
    // await preset reactions

    collector.addListener('collect', async (reaction, user: User) => {
      if (reaction.emoji.id === qEmoji.id) {
        // this.ebus.publish(new DiscordEnterQueueEvent(qp, command.mode));
        // for now
        await this.cbus.execute(new PlayerEnterQueueCommand(user.id, mode));
      } else if (reaction.emoji.id === deqEmoji.id) {
        await this.cbus.execute(new PlayerLeaveQueueCommand(user.id, mode));
      }
      await msg?.reactions.resolve(reaction.emoji.id)?.users.remove(user.id);
    });

    this.logger.log(`Listening to reactions for mode [${mode}]`);
  }
}
