import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class GatewayService implements OnApplicationBootstrap {
  constructor(
    @Inject('CoreMicroService') private client: ClientProxy,
    private readonly ebus: EventBus,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }
}
