import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Constructor, EventBus } from '@nestjs/cqrs';
import { inspect } from 'util';
import { QueueCreatedEvent } from './gateway/events/queue-created.event';
import { QueueUpdatedEvent } from './gateway/events/queue-updated.event';

@Controller()
export class GatewayController {
  constructor(private readonly ebus: EventBus) {}

  private readonly logger = new Logger(GatewayController.name)

  private event<T>(constructor: Constructor<T>, data: any) {
    const buff = data;
    buff.__proto__ = constructor.prototype;
    this.ebus.publish(buff);
    this.logger.log(inspect(buff))
  }

  @EventPattern('QueueUpdatedEvent')
  async QueueUpdatedEvent(data: QueueUpdatedEvent) {
    this.event(QueueUpdatedEvent, data);
  }

  @EventPattern('QueueCreatedEvent')
  async QueueCreatedEvent(data: QueueCreatedEvent) {
      this.event(QueueCreatedEvent, data);
  }
}
