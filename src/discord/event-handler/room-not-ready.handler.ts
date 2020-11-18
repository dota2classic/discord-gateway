import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RoomNotReadyEvent } from "../../gateway/events/room-not-ready.event";
import { Client } from "discord.js";
import { DiscordUserRepository } from "../repository/discord-user.repository";
import { I18nService } from "../service/i18n.service";

@EventsHandler(RoomNotReadyEvent)
export class RoomNotReadyHandler implements IEventHandler<RoomNotReadyEvent> {
  constructor(
    private client: Client,
    private readonly discordUserRepository: DiscordUserRepository,
    private readonly i18nService: I18nService
  ) {}

  async handle(event: RoomNotReadyEvent) {
    const discordUsers = (
      await Promise.all(
        event.players.map(async t => ({
          entry: t,
          discordId: await this.discordUserRepository.findByPlayerId(t),
        })),
      )
    ).filter(t => !!t.discordId);

    discordUsers.map(async t => {
      const u = await this.client.users.resolve(t.discordId.discordId);
      u.send(
        this.i18nService.roomNotReady()
      )
    });
  }
}
