import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EventPublisher } from '@nestjs/cqrs';
import { QueueMessageSyncModel } from 'src/queue/model/queue-message-sync.model';
import { DISCORD_GATEWAY_HOST, REDIS_URL } from 'src/config/env';

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
  app.listen(() => console.log('Microservice is listening'));

  const publisher = app.get(EventPublisher);
  prepareModels(publisher);
}
bootstrap();
