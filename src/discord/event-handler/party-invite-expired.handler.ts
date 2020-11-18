import { EventsHandler, IEventHandler, QueryBus } from "@nestjs/cqrs";
import { PartyInviteExpiredEvent } from "../../gateway/events/party/party-invite-expired.event";
import { Client } from "discord.js";
import { DiscordUserRepository } from "../repository/discord-user.repository";
import { I18nService } from "../service/i18n.service";

@EventsHandler(PartyInviteExpiredEvent)
export class PartyInviteExpiredHandler
  implements IEventHandler<PartyInviteExpiredEvent> {
  constructor(
    private readonly client: Client,
    private readonly queryBus: QueryBus,
    private readonly userRep: DiscordUserRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(event: PartyInviteExpiredEvent) {
    const u = this.userRep.findByPlayerId(event.invited);
    if (!u) return;

    const user = await this.client.users.resolve(u.discordId);

    await user.send(this.i18n.partyInviteExpired());
  }
}
