import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { MatchmakingMode } from 'src/gateway/shared-types/matchmaking-mode';
import { GatewayQueueStateQuery } from 'src/gateway/queries/GatewayQueueState/gateway-queue-state.query';

@Injectable()
export class GatewayService implements OnApplicationBootstrap {
  constructor(
    @Inject('RedisEventQueue') private client: ClientProxy,
    @Inject('QueryCore') private queryCore: ClientProxy,
    private readonly ebus: EventBus,
    private readonly qbus: QueryBus,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
    await this.queryCore.connect();

    console.log(
      await this.qbus.execute(
        new GatewayQueueStateQuery(MatchmakingMode.SOLOMID),
      ),
    );
  }
}