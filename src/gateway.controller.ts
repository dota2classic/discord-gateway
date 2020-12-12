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
import { PartyInviteCreatedEvent } from 'gateway/events/party/party-invite-created.event';
import { PartyInviteExpiredEvent } from 'gateway/events/party/party-invite-expired.event';
import { GameResultsEvent } from "./gateway/events/gs/game-results.event";
import { PartyInviteResultEvent } from "./gateway/events/party/party-invite-result.event";
import { EnterQueueDeclinedEvent } from "./gateway/events/mm/enter-queue-declined.event";
import { UserUpdatedEvent } from "./gateway/events/user/user-updated.event";

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

  @EventPattern(PartyInviteResultEvent.name)
  async PartyInviteResultEvent(data: PartyInviteResultEvent) {
    this.event(PartyInviteResultEvent, data);
  }

  @EventPattern(MatchFinishedEvent.name)
  async MatchFinishedEvent(data: MatchFinishedEvent) {
    this.event(MatchFinishedEvent, data);
  }

  @EventPattern(EnterQueueDeclinedEvent.name)
  async EnterQueueDeclinedEvent(data: EnterQueueDeclinedEvent) {
    this.event(EnterQueueDeclinedEvent, data);
  }


  @EventPattern(GameResultsEvent.name)
  async GameResultsEvent(data: GameResultsEvent) {
    this.event(GameResultsEvent, data);
  }

  @EventPattern(GameServerStartedEvent.name)
  async GameServerStartedEvent(data: GameServerStartedEvent) {
    this.event(GameServerStartedEvent, data);
  }



  @EventPattern(PartyInviteCreatedEvent.name)
  async PartyInviteCreatedEvent(data: PartyInviteCreatedEvent) {
    this.event(PartyInviteCreatedEvent, data);
  }

  @EventPattern(PartyInviteExpiredEvent.name)
  async PartyInviteExpiredEvent(data: PartyInviteExpiredEvent) {
    this.event(PartyInviteExpiredEvent, data);
  }


  @EventPattern(UserUpdatedEvent.name)
  async UserUpdatedEvent(data: UserUpdatedEvent) {
    this.event(UserUpdatedEvent, data);
  }
}
