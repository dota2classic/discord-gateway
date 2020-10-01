import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [
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