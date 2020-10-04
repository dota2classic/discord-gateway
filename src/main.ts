import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CommandBus, EventBus, EventPublisher } from '@nestjs/cqrs';
import { QueueMessageSyncModel } from 'queue/model/queue-message-sync.model';
import { REDIS_URL } from 'config/env';
import { Logger } from '@nestjs/common';
import { MicroserviceStartedEvent } from 'queue/event/microservice-started.event';
import { Subscriber } from 'rxjs';
import { inspect } from 'util';

require('dotenv').config();

export function prepareModels(publisher: EventPublisher) {
  publisher.mergeClassContext(QueueMessageSyncModel);
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        url: REDIS_URL(),
        retryAttempts: 10,
        retryDelay: 5000,
      },
    },
  );

  await app.listenAsync();
  new Logger(`DiscordGateway`).log(`Started microservice`);

  const publisher = app.get(EventPublisher);
  prepareModels(publisher);

  const ebus = app.get(EventBus);
  const cbus = app.get(CommandBus);

  const clogger = new Logger('CommandLogger');
  const elogger = new Logger('EventLogger');

  ebus._subscribe(
    new Subscriber<any>(e => {
      elogger.log(
        `${inspect(e)}`,
        // e.__proto__.constructor.name,
      );
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
}
bootstrap();
