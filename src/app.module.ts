import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { devDbConfig, Entities, prodDbConfig } from './config/typeorm.config';
import { QueueProviders } from 'src/queue';
import { ClientProvider, GuildProvider } from 'src/config/discord.provider';
import { isDev } from 'src/config/env';



@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot(
      (isDev ? devDbConfig : prodDbConfig) as TypeOrmModuleOptions,
    ),
    TypeOrmModule.forFeature(Entities),
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.TCP,
        options: { port: 5000 },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [
    ClientProvider,
    GuildProvider,

    GatewayService,
    AppService,
    ...QueueProviders,
  ],
})
export class AppModule {}
