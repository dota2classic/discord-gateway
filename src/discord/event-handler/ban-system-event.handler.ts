import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerNotLoadedEvent } from "../../gateway/events/bans/player-not-loaded.event";
import { Client, Guild, TextChannel } from "discord.js";
import { steamIdToNum } from "../service/util/steamids";
import { DiscordUserRepository } from "../repository/discord-user.repository";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { BanSystemEvent } from "../../gateway/events/gs/ban-system.event";
import { I18nService } from "../service/i18n.service";
import { dmItachi } from "../../util/dmItachi";

@EventsHandler(BanSystemEvent)
export class BanSystemEventHandler
  implements IEventHandler<BanSystemEvent> {
  constructor(
    private client: Client,
    private readonly guild: Guild,
    private readonly userRep: DiscordUserRepository,
    private readonly i18nService: I18nService
  ) {}

  async handle(event: BanSystemEvent) {
    // const ch = this.guild.channels.resolve('720288119227678832') as TextChannel;

    const duser = this.userRep.findByPlayerId(event.id)
    // await ch.send(this.i18nService.banSystemLog(event, duser));
    await dmItachi(this.client, this.i18nService.banSystemLog(event, duser))
  }
}
