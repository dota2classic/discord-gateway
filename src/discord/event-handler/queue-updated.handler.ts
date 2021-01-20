import { EventBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { QueueUpdatedEvent } from 'gateway/events/queue-updated.event';
import { Client, Guild } from 'discord.js';
import {
  QueueEntry,
  QueueUpdateReceivedEvent,
} from 'discord/event/queue-update-received.event';
import {DiscordUserRepository} from "../repository/discord-user.repository";
import { GetQueueStateQueryResult } from "../../gateway/queries/QueueState/get-queue-state-query.result";
import { GetQueueStateQuery } from "../../gateway/queries/QueueState/get-queue-state.query";

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
    const qs: GetQueueStateQueryResult = await this.qbus.execute(
      new GetQueueStateQuery(event.mode),
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
