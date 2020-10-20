import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MatchFinishedEvent } from '../../gateway/events/match-finished.event';
import { Client, TextChannel } from 'discord.js';
import { LiveMatchRepository } from '../repository/live-match.repository';

@EventsHandler(MatchFinishedEvent)
export class MatchFinishedHandler implements IEventHandler<MatchFinishedEvent> {
  constructor(
    private client: Client,
    private readonly liveMatchRepo: LiveMatchRepository,
  ) {}

  async handle(event: MatchFinishedEvent) {
    const m = await this.liveMatchRepo.get(event.matchId);

    if (m) {
      const ch = (await this.client.channels.resolve(
        m.channelId,
      )) as TextChannel;
      const msg = await ch.messages.resolve(m.messageId);
      await msg.delete();
      await this.liveMatchRepo.delete(event.matchId);
    }
  }
}
