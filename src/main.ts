import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EventPublisher } from '@nestjs/cqrs';
import { QueueMessageSyncModel } from 'queue/model/queue-message-sync.model';
import { REDIS_URL } from 'config/env';
import { Logger } from '@nestjs/common';

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
  new Logger(`DiscordGateway`).log(`Started microservice`)

  const publisher = app.get(EventPublisher);
  prepareModels(publisher);
}
bootstrap();
