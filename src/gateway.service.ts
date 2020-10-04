import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class GatewayService implements OnApplicationBootstrap {
  constructor(
    @Inject('QueryCore') private queryCore: ClientProxy,
    private readonly ebus: EventBus,
    private readonly qbus: QueryBus,
  ) {}

  async onApplicationBootstrap() {
    await this.queryCore.connect();
  }
}
