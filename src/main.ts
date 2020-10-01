import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { retryAttempts: 5, retryDelay: 3000, port: 5001 },
    },
  );
  app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
