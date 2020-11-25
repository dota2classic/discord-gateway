import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CommandBus, EventBus, EventPublisher, QueryBus } from '@nestjs/cqrs';
import { QueueMessageSyncModel } from 'queue/model/queue-message-sync.model';
import {REDIS_PASSWORD, REDIS_URL} from 'config/env';
import { INestMicroservice, Logger } from '@nestjs/common';
import { MicroserviceStartedEvent } from 'queue/event/microservice-started.event';
import { Subscriber } from 'rxjs';
import { inspect } from 'util';
import { ReadyCheckModel } from './discord/model/ready-check.model';
import { DiscordMessageEvent } from './discord/event/discord-message.event';
import { DiscordUserModel } from './discord/model/discord-user.model';
import { DiscordUserRepository } from './discord/repository/discord-user.repository';
import { GetAllConnectionsQuery } from './gateway/queries/GetAllConnections/get-all-connections.query';
import { UserConnection } from './gateway/shared-types/user-connection';
import { GetAllConnectionsQueryResult } from './gateway/queries/GetAllConnections/get-all-connections-query.result';
import { EngageNeededEvent } from "./discord/event/engage-needed.event";

export function prepareModels(publisher: EventPublisher) {
  publisher.mergeClassContext(QueueMessageSyncModel);
  publisher.mergeClassContext(DiscordUserModel);
  publisher.mergeClassContext(ReadyCheckModel);
}

async function initRuntimeData(app: INestMicroservice) {
  const qbus = app.get(QueryBus);
  const discordUserRepository = app.get(DiscordUserRepository);

  const cons = await qbus.execute<
    GetAllConnectionsQuery,
    GetAllConnectionsQueryResult
  >(new GetAllConnectionsQuery(UserConnection.DISCORD));


  console.log(`Received ${cons.entries.length} entries`);
  cons.entries.forEach(t => {
    discordUserRepository.save(
      t.externalId,
      new DiscordUserModel(t.externalId, t.id),
    );
  });
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        url: REDIS_URL(),
        retryAttempts: Infinity,
        retryDelay: 5000,
        password: REDIS_PASSWORD(),
      },
    },
  );

  await app.listenAsync();
  new Logger(`DiscordGateway`).log(`Started microservice`);

  await initRuntimeData(app);

  const publisher = app.get(EventPublisher);
  prepareModels(publisher);

  const ebus = app.get(EventBus);
  const cbus = app.get(CommandBus);

  const clogger = new Logger('CommandLogger');
  const elogger = new Logger('EventLogger');

  ebus._subscribe(
    new Subscriber<any>(e => {
      if (e.__proto__.constructor.name === DiscordMessageEvent.name)
        elogger.log(e.__proto__.constructor.name);
      else elogger.log(`${inspect(e)}`);
    }),
  );

  cbus._subscribe(
    new Subscriber<any>(e => {
      clogger.log(
        `${inspect(e)}`,
        // e.__proto__.constructor.name,
      );
    }),
  );

  app.get(EventBus).publish(new MicroserviceStartedEvent());
  console.log(`?`)



  ebus.publish(new EngageNeededEvent())

}
bootstrap();
