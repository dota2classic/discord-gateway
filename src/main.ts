import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EventPublisher } from '@nestjs/cqrs';
import { QueueMessageSyncModel } from 'src/queue/model/queue-message-sync.model';
require('dotenv').config()


export function prepareModels(publisher: EventPublisher) {
  publisher.mergeClassContext(QueueMessageSyncModel);
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { retryAttempts: 5, retryDelay: 3000, port: 5001 },
    },
  );
  app.listen(() => console.log('Microservice is listening'));

  const publisher = app.get(EventPublisher);
  prepareModels(publisher);
}
bootstrap();
