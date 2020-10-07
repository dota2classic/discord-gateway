import { Injectable } from '@nestjs/common';
import { Client, Snowflake, TextChannel } from 'discord.js';
import { QueueEntry } from 'discord/event/queue-update-received.event';
import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { messages } from 'util/i18n';

@Injectable()
export class DiscordService {
  constructor(private readonly client: Client) {}

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

    await msg.edit(messages.queueMessage(mode, entries));
  }
}
