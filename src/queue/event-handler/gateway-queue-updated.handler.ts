import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GatewayQueueUpdatedEvent } from '../../gateway/events/gateway-queue-updated.event';
import { Client } from '@nestjs/microservices/external/nats-client.interface';

@EventsHandler(GatewayQueueUpdatedEvent)
export class GatewayQueueUpdatedHandler implements IEventHandler<GatewayQueueUpdatedEvent> {

  constructor(private client: Client) {}

  async handle(event: GatewayQueueUpdatedEvent) {

  }
}
