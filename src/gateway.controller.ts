import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Constructor, EventBus } from '@nestjs/cqrs';
import { inspect } from 'util';
import { QueueCreatedEvent } from './gateway/events/queue-created.event';
import { QueueUpdatedEvent } from './gateway/events/queue-updated.event';
import { ReadyCheckStartedEvent } from './gateway/events/ready-check-started.event';
import { ReadyStateUpdatedEvent } from 'gateway/events/ready-state-updated.event';
import { MatchStartedEvent } from './gateway/events/match-started.event';
import { MatchFinishedEvent } from 'gateway/events/match-finished.event';
import { GameServerStartedEvent } from './gateway/events/game-server-started.event';
import { RoomNotReadyEvent } from './gateway/events/room-not-ready.event';
import { UserConnectionCreatedEvent } from 'gateway/events/user/user-connection-created.event';

@Controller()
export class GatewayController {
  constructor(private readonly ebus: EventBus) {}

  private readonly logger = new Logger(GatewayController.name);

  private event<T>(constructor: Constructor<T>, data: any) {
    const buff = data;
    buff.__proto__ = constructor.prototype;
    this.ebus.publish(buff);
    this.logger.log(inspect(buff));
  }

  @EventPattern('QueueUpdatedEvent')
  async QueueUpdatedEvent(data: QueueUpdatedEvent) {
    this.event(QueueUpdatedEvent, data);
  }

  @EventPattern('QueueCreatedEvent')
  async QueueCreatedEvent(data: QueueCreatedEvent) {
    this.event(QueueCreatedEvent, data);
    this.event(QueueUpdatedEvent, data);
  }

  @EventPattern(UserConnectionCreatedEvent.name)
  async UserConnectionCreatedEvent(data: UserConnectionCreatedEvent) {
    this.event(UserConnectionCreatedEvent, data);
  }

  @EventPattern('ReadyCheckStartedEvent')
  async ReadyCheckStartedEvent(data: ReadyCheckStartedEvent) {
    this.event(ReadyCheckStartedEvent, data);
  }

  @EventPattern(ReadyStateUpdatedEvent.name)
  async ReadyStateUpdatedEvent(data: ReadyStateUpdatedEvent) {
    this.event(ReadyStateUpdatedEvent, data);
  }

  @EventPattern(RoomNotReadyEvent.name)
  async RoomNotReadyEvent(data: RoomNotReadyEvent) {
    this.event(RoomNotReadyEvent, data);
  }

  @EventPattern(MatchStartedEvent.name)
  async MatchStartedEvent(data: MatchStartedEvent) {
    this.event(MatchStartedEvent, data);
  }

  @EventPattern(MatchFinishedEvent.name)
  async MatchFinishedEvent(data: MatchFinishedEvent) {
    this.event(MatchFinishedEvent, data);
  }

  @EventPattern(GameServerStartedEvent.name)
  async GameServerStartedEvent(data: GameServerStartedEvent) {
    this.event(GameServerStartedEvent, data);
  }
}
