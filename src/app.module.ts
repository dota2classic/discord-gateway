import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.TCP,
        options: { port: 5000 },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService, AppService],
})
export class AppModule {}