import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GatewayQueueCreatedEvent } from '../../gateway/events/gateway-queue-created.event';
import { Client } from '@nestjs/microservices/external/nats-client.interface';

@EventsHandler(GatewayQueueCreatedEvent)
export class GatewayQueueCreatedHandler
  implements IEventHandler<GatewayQueueCreatedEvent> {
  constructor(private client: Client, private readonly ebus: EventBus) {}

  async handle(event: GatewayQueueCreatedEvent) {}
}
