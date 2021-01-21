import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerNotLoadedEvent } from "../../gateway/events/bans/player-not-loaded.event";
import { Client, Guild, TextChannel } from "discord.js";
import { steamIdToNum } from "../service/util/steamids";
import { DiscordUserRepository } from "../repository/discord-user.repository";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { PlayerDeclinedGameEvent } from "../../gateway/events/mm/player-declined-game.event";

@EventsHandler(PlayerDeclinedGameEvent)
export class PlayerDeclinedGameHandler
  implements IEventHandler<PlayerDeclinedGameEvent> {
  constructor(
    private client: Client,
    private readonly guild: Guild,
    private readonly userRep: DiscordUserRepository,
  ) {}

  async handle(event: PlayerDeclinedGameEvent) {
    const ch = this.guild.channels.resolve('720288119227678832') as TextChannel;

    const duser = this.userRep.findByPlayerId(event.id)
    await ch.send(
      `Игрок https://dota2classic.ru/player/${steamIdToNum(
        event.id.value,
      )} не принял игру. ${duser && `<@${duser.discordId}>`}`,
    );
  }
}
