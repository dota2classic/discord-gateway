
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GatewayQueueStateQuery } from 'src/gateway/queries/GatewayQueueState/gateway-queue-state.query';
import { GatewayQueueStateResult } from 'src/gateway/queries/GatewayQueueState/gateway-queue-state.result';

@QueryHandler(GatewayQueueStateQuery)
export class GatewayQueueStateHandler
  implements IQueryHandler<GatewayQueueStateQuery, GatewayQueueStateResult> {
  private readonly logger = new Logger(GatewayQueueStateHandler.name);

  constructor(@Inject('QueryCore') private queryCore: ClientProxy) {}

  async execute(command: GatewayQueueStateQuery) {
    return this.queryCore
      .send<GatewayQueueStateResult>(GatewayQueueStateQuery.name, command)
      .toPromise();
  }
}
