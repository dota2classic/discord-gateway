import { EventBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { QueueUpdatedEvent } from 'src/gateway/events/queue-updated.event';
import { Client } from 'discord.js';
import { QueueStateQueryResult } from 'src/gateway/queries/QueueState/queue-state-query.result';
import { QueueStateQuery } from 'src/gateway/queries/QueueState/queue-state.query';

@EventsHandler(QueueUpdatedEvent)
export class QueueUpdatedHandler implements IEventHandler<QueueUpdatedEvent> {
  constructor(
    private client: Client,
    private readonly ebus: EventBus,
    private readonly qbus: QueryBus,
  ) {
    // ok lets try it.
  }

  async handle(event: QueueUpdatedEvent) {
    const qs: QueueStateQueryResult = await this.qbus.execute(
      new QueueStateQuery(event.mode),
    );
  }
}
