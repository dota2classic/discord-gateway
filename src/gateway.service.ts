import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventBus, ofType, QueryBus } from '@nestjs/cqrs';
import { ReadyStateReceivedEvent } from './gateway/events/ready-state-received.event';
import { PartyInviteAcceptedEvent } from './gateway/events/party/party-invite-accepted.event';

@Injectable()
export class GatewayService implements OnApplicationBootstrap {
  constructor(
    @Inject('QueryCore') private queryCore: ClientProxy,
    private readonly ebus: EventBus,
    private readonly qbus: QueryBus,
  ) {}

  async onApplicationBootstrap() {
    await this.queryCore.connect();

    const publicEvents: any[] = [
      PartyInviteAcceptedEvent,
      ReadyStateReceivedEvent,
    ];
    this.ebus
      .pipe(ofType(...publicEvents))
      .subscribe(t => this.queryCore.emit(t.constructor.name, t));
  }
}
