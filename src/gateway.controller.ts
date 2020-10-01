import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Constructor, EventBus } from '@nestjs/cqrs';
import { GatewayQueueUpdatedEvent } from './gateway/events/gateway-queue-updated.event';
import { GatewayQueueCreatedEvent } from './gateway/events/gateway-queue-created.event';

@Controller()
export class GatewayController {
  constructor(private readonly ebus: EventBus) {}

  private event<T>(constructor: Constructor<T>, data: any) {
    const buff = data;
    buff.__proto__ = constructor.prototype;
    this.ebus.publish(buff);
  }

  @EventPattern('GatewayQueueUpdatedEvent')
  async GatewayQueueUpdatedEvent(data: GatewayQueueUpdatedEvent) {
    this.event(GatewayQueueUpdatedEvent, data);
  }

  @EventPattern('GatewayQueueCreatedEvent')
  async GatewayQueueCreatedEvent(data: GatewayQueueCreatedEvent) {
      this.event(GatewayQueueCreatedEvent, data);
  }
}
