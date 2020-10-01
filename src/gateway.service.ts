import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GatewayService implements OnApplicationBootstrap {
  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();

  }
}
