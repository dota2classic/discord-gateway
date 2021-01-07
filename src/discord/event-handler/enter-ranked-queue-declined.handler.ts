import { EventsHandler, IEventHandler, QueryBus } from "@nestjs/cqrs";
import { EnterRankedQueueDeclinedEvent } from "../../gateway/events/mm/enter-ranked-queue-declined.event";
import { Client } from "discord.js";
import { GetPlayerInfoQuery } from "../../gateway/queries/GetPlayerInfo/get-player-info.query";
import { GetPlayerInfoQueryResult } from "../../gateway/queries/GetPlayerInfo/get-player-info-query.result";
import { Dota2Version } from "../../gateway/shared-types/dota2version";
import { DiscordUserRepository } from "../repository/discord-user.repository";
import { I18nService } from "../service/i18n.service";

@EventsHandler(EnterRankedQueueDeclinedEvent)
export class EnterRankedQueueDeclinedHandler
  implements IEventHandler<EnterRankedQueueDeclinedEvent> {
  constructor(
    private readonly client: Client,
    private readonly discordUserRepository: DiscordUserRepository,
    private readonly i18nService: I18nService,
    private readonly qbus: QueryBus,
  ) {}

  async handle(event: EnterRankedQueueDeclinedEvent) {
    const discordUsers = (
      await Promise.all(
        event.newPlayers.map(t =>
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
      if (info.summary.newbieGamesLeft === 0) return;

      await dUser.send(this.i18nService.rankedLocked(info.summary.newbieGamesLeft));
    });

    await Promise.all(a);
  }
}
