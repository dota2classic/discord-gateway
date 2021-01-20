import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerNotLoadedEvent } from "../../gateway/events/bans/player-not-loaded.event";
import { Client, Guild, TextChannel } from "discord.js";
import { steamIdToNum } from "../service/util/steamids";

@EventsHandler(PlayerNotLoadedEvent)
export class PlayerNotLoadedHandler
  implements IEventHandler<PlayerNotLoadedEvent> {
  constructor(private client: Client, private readonly guild: Guild) {}

  async handle(event: PlayerNotLoadedEvent) {
    const ch = this.guild.channels.resolve('720288119227678832') as TextChannel;
    await ch.send(
      `Игрок https://dota2classic.ru/players/${steamIdToNum(
        event.playerId.value,
      )} не загрузился в игру ${event.matchId}`,
    );
  }
}
