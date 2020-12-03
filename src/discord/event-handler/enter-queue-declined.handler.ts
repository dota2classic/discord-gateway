import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { EnterQueueDeclinedEvent } from '../../gateway/events/mm/enter-queue-declined.event';
import { Client } from 'discord.js';
import { DiscordUserRepository } from '../repository/discord-user.repository';
import { I18nService } from '../service/i18n.service';
import { GetPlayerInfoQuery } from '../../gateway/queries/GetPlayerInfo/get-player-info.query';
import { GetPlayerInfoQueryResult } from '../../gateway/queries/GetPlayerInfo/get-player-info-query.result';
import { Dota2Version } from '../../gateway/shared-types/dota2version';

@EventsHandler(EnterQueueDeclinedEvent)
export class EnterQueueDeclinedHandler
  implements IEventHandler<EnterQueueDeclinedEvent> {
  constructor(
    private readonly client: Client,
    private readonly discordUserRepository: DiscordUserRepository,
    private readonly i18nService: I18nService,
    private readonly qbus: QueryBus,
  ) {}

  async handle(event: EnterQueueDeclinedEvent) {
    const discordUsers = (
      await Promise.all(
        event.bannedPlayers.map(t =>
          this.discordUserRepository.findByPlayerId(t),
        ),
      )
    ).filter(t => !!t.discordId);

    const a = discordUsers.map(async t => {
      const dUser = this.client.users.resolve(t.discordId);
      const info = await this.qbus.execute<
        GetPlayerInfoQuery,
        GetPlayerInfoQueryResult
      >(new GetPlayerInfoQuery(t.playerId, Dota2Version.Dota_681));
      // if not banned we skip
      if(!info.banStatus?.isBanned) return;

      await dUser.send(this.i18nService.matchmakingBanned(info.banStatus))
    });

    await Promise.all(a);
  }
}
