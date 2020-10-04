import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { devDbConfig, Entities, prodDbConfig } from './config/typeorm.config';
import { QueueProviders } from 'queue';
import { ClientProvider, GuildProvider } from 'config/discord.provider';
import { CORE_GATEWAY_HOST, isDev, REDIS_URL } from 'config/env';
import { DiscordProviders } from 'discord';


@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot(
      (isDev ? devDbConfig : prodDbConfig) as TypeOrmModuleOptions,
    ),
    TypeOrmModule.forFeature(Entities),
    ClientsModule.register([
      {
        name: 'RedisEventQueue',
        transport: Transport.REDIS,
        options: {
          url: REDIS_URL(),
          retryAttempts: 10,
          retryDelay: 5000,
        },
      },
      {
        name: 'QueryCore',
        transport: Transport.REDIS,
        options: {
          url: REDIS_URL(),
          retryAttempts: 10,
          retryDelay: 5000,
        },
      },
    ] as any),
  ],
  controllers: [GatewayController],
  providers: [
    ClientProvider,
    GuildProvider,

    GatewayService,
    AppService,
    ...QueueProviders,
    ...DiscordProviders
  ],
})
export class AppModule {}
