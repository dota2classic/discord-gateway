import { Module } from '@nestjs/common';
import { AppService } from 'app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayService } from 'gateway.service';
import { GatewayController } from 'gateway.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { devDbConfig, Entities, prodDbConfig } from 'config/typeorm.config';
import { QueueProviders } from 'queue';
import { ClientProvider, GuildProvider } from 'config/discord.provider';
import {CORE_GATEWAY_HOST, isDev, REDIS_PASSWORD, REDIS_URL} from 'config/env';
import { DiscordProviders } from 'discord';
import { SentryModule } from "@ntegral/nestjs-sentry";
import { ScheduleModule } from "@nestjs/schedule";
import { outerQuery } from "./gateway/util/outerQuery";
import { GetRoleSubscriptionsQuery } from "./gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query";


@Module({
  imports: [
    ScheduleModule.forRoot(),
    SentryModule.forRoot({
      dsn:
        "https://24a4773cd3cb4072b6b80f160385a384@o435989.ingest.sentry.io/5531861",
      debug: false,
      environment: isDev ? "dev" : "production",
      logLevel: 2, //based on sentry.io loglevel //
    }),
    CqrsModule,
    TypeOrmModule.forRoot(
      (isDev ? devDbConfig : prodDbConfig) as TypeOrmModuleOptions,
    ),
    TypeOrmModule.forFeature(Entities),
    ClientsModule.register([
      {
        name: 'QueryCore',
        transport: Transport.REDIS,
        options: {
          url: REDIS_URL(),
          retryAttempts: Infinity,
          retryDelay: 5000,
          password: REDIS_PASSWORD(),
        },
      },
    ] as any),
  ],
  controllers: [GatewayController],
  providers: [
    ClientProvider,
    GuildProvider,
    GatewayService,
    ...QueueProviders,
    ...DiscordProviders,
    AppService,
  ],
})
export class AppModule {}
