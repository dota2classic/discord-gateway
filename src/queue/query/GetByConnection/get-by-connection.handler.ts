import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {QueueStateQuery} from "../../../gateway/queries/QueueState/queue-state.query";
import {QueueStateQueryResult} from "../../../gateway/queries/QueueState/queue-state-query.result";
import {Inject, Logger} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {GetByConnectionQueryResult} from "../../../gateway/queries/GetByConnection/get-by-connection-query.result";
import {GetByConnectionQuery} from "../../../gateway/queries/GetByConnection/get-by-connection.query";

@QueryHandler(GetByConnectionQuery)
export class GetByConnectionHandler
  implements IQueryHandler<GetByConnectionQuery, GetByConnectionQueryResult> {
  private readonly logger = new Logger(GetByConnectionHandler.name);

  constructor(@Inject('QueryCore') private queryCore: ClientProxy) {}

  async execute(command: GetByConnectionQuery): Promise<GetByConnectionQueryResult> {
    return this.queryCore
      .send<GetByConnectionQueryResult>(GetByConnectionQuery.name, command)
      .toPromise();
  }
}
