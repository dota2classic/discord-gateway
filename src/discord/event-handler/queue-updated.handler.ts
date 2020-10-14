import { EventBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { QueueUpdatedEvent } from 'gateway/events/queue-updated.event';
import { Client, Guild } from 'discord.js';
import { QueueStateQueryResult } from 'gateway/queries/QueueState/queue-state-query.result';
import { QueueStateQuery } from 'gateway/queries/QueueState/queue-state.query';
import {
  QueueEntry,
  QueueUpdateReceivedEvent,
} from 'discord/event/queue-update-received.event';
import {DiscordUserRepository} from "../repository/discord-user.repository";

@EventsHandler(QueueUpdatedEvent)
export class QueueUpdatedHandler implements IEventHandler<QueueUpdatedEvent> {
  constructor(
    private client: Client,
    private guild: Guild,
    private readonly ebus: EventBus,
    private readonly qbus: QueryBus,
    private readonly discordUserRepository: DiscordUserRepository
  ) {
    // ok lets try it.
  }

  async handle(event: QueueUpdatedEvent) {
    const qs: QueueStateQueryResult = await this.qbus.execute(
      new QueueStateQuery(event.mode),
    );

    const entries: QueueEntry[] = [];
    qs.entries.forEach(t => {
      t.players.forEach(z => {
        entries.push({
          id: z,
          isDiscord: !!this.discordUserRepository.findByPlayerId(z)
        });
      });
    });

    console.log(entries)
    this.ebus.publish(new QueueUpdateReceivedEvent(event.mode, entries));
  }
}
