import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PartyInviteResultEvent } from "../../gateway/events/party/party-invite-result.event";
import { Client } from "discord.js";
import { DiscordUserRepository } from "../repository/discord-user.repository";
import { I18nService } from "../service/i18n.service";

@EventsHandler(PartyInviteResultEvent)
export class PartyInviteResultHandler
  implements IEventHandler<PartyInviteResultEvent> {
  constructor(
    private client: Client,
    private readonly userRep: DiscordUserRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(event: PartyInviteResultEvent) {
    const du = this.userRep.findByPlayerId(event.inviter);
    if (!du) return;

    const user = this.client.users.resolve(du.discordId);
    const u2 = this.userRep.findByPlayerId(event.invited);

    await user.send(
      this.i18n.partyInviteResult(
        event.accept,
        this.client.users.resolve(u2.discordId)?.username,
      ),
    );
  }
}
