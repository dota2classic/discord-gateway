import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {QueueStateQuery} from "../../../gateway/queries/QueueState/queue-state.query";
import {QueueStateQueryResult} from "../../../gateway/queries/QueueState/queue-state-query.result";
import {Inject, Logger} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {GetAllConnectionsQuery} from "../../../gateway/queries/GetAllConnections/get-all-connections.query";
import {GetAllConnectionsQueryResult} from "../../../gateway/queries/GetAllConnections/get-all-connections-query.result";

@QueryHandler(GetAllConnectionsQuery)
export class GetAllConnectionsHandler
  implements IQueryHandler<GetAllConnectionsQuery, GetAllConnectionsQueryResult> {
  private readonly logger = new Logger(GetAllConnectionsHandler.name);

  constructor(@Inject('QueryCore') private queryCore: ClientProxy) {}

  async execute(command: GetAllConnectionsQuery): Promise<GetAllConnectionsQueryResult> {
    return this.queryCore
      .send<GetAllConnectionsQueryResult>(GetAllConnectionsQuery.name, command)
      .toPromise();
  }
}