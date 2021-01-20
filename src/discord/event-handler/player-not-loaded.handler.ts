import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerNotLoadedEvent } from "../../gateway/events/bans/player-not-loaded.event";
import { Client, Guild, TextChannel } from "discord.js";
import { steamIdToNum } from "../service/util/steamids";
import { DiscordUserRepository } from "../repository/discord-user.repository";
import { PlayerId } from "../../gateway/shared-types/player-id";

@EventsHandler(PlayerNotLoadedEvent)
export class PlayerNotLoadedHandler
  implements IEventHandler<PlayerNotLoadedEvent> {
  constructor(
    private client: Client,
    private readonly guild: Guild,
    private readonly userRep: DiscordUserRepository,
  ) {}

  async handle(event: PlayerNotLoadedEvent) {
    const ch = this.guild.channels.resolve('720288119227678832') as TextChannel;

    const duser = this.userRep.findByPlayerId(event.playerId)
    await ch.send(
      `Игрок https://dota2classic.ru/player/${steamIdToNum(
        event.playerId.value,
      )} не загрузился в игру ${event.matchId}. ${duser && `<@${duser.discordId}>`}`,
    );
  }
}
