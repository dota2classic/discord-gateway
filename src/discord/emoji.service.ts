import { Injectable } from '@nestjs/common';
import { Client, Emoji, GuildEmoji } from 'discord.js';
import { isDev } from 'config/env';

@Injectable()
export class EmojiService {
  constructor(private readonly client: Client) {}

  private queueEmoji: GuildEmoji;
  private dequeueEmoji: GuildEmoji;

  private static queueEmojiName = isDev ? "armlet" :  "pudge"
  private static dequeueEmojiName = isDev ? "aegis" :  "krobelus"

  public async getQueueEmoji(): Promise<GuildEmoji> {
    if (this.queueEmoji) return this.queueEmoji;

    const queueEmoji = (await this.client.emojis.cache.find(
      it => it.name === EmojiService.queueEmojiName,
    )!!)!!;
    this.queueEmoji = queueEmoji;
    return queueEmoji;
  }

  public async getDequeueEmoji(): Promise<GuildEmoji> {
    if (this.dequeueEmoji) return this.dequeueEmoji;

    const dequeueEmoji = (await this.client.emojis.cache.find(
      it => it.name === EmojiService.dequeueEmojiName,
    )!!)!!;
    this.dequeueEmoji = dequeueEmoji;
    return dequeueEmoji;
  }
}
