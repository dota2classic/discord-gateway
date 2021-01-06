import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DiscordNewMemberEvent } from "../event/discord-new-member.event";
import { Client } from "discord.js";
import { I18nService } from "../service/i18n.service";

@EventsHandler(DiscordNewMemberEvent)
export class DiscordNewMemberHandler implements IEventHandler<DiscordNewMemberEvent> {
  constructor(private client: Client, private readonly i18n: I18nService) {}

  async handle(event: DiscordNewMemberEvent) {
    const u = this.client.users.resolve(event.id)

    const res = await u.send(this.i18n.welcomeMessage())

    console.log(`sent`, res)
  }
}
