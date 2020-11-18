import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DiscordEnterQueueEvent } from '../event/discord-enter-queue.event';
import { DiscordUserRepository } from '../repository/discord-user.repository';
import { PlayerEnterQueueCommand } from '../../gateway/commands/player-enter-queue.command';
import { Client } from "discord.js";
import { I18nService } from "../service/i18n.service";

@EventsHandler(DiscordEnterQueueEvent)
export class DiscordEnterQueueHandler
  implements IEventHandler<DiscordEnterQueueEvent> {
  constructor(
    private readonly discordUserRepository: DiscordUserRepository,
    private readonly cbus: CommandBus,
    private readonly client: Client,
    private readonly i18nService: I18nService
  ) {}

  async handle(event: DiscordEnterQueueEvent) {
    const player = this.discordUserRepository.get(event.discordId);

    if (!player) {
      // todo: emit event that no steam attached
      const u = await this.client.users.resolve(event.discordId);
      u.send(
        this.i18nService.noDiscordAttachment()
      )

      return;
    }

    await this.cbus.execute(
      new PlayerEnterQueueCommand(player.playerId, event.mode),
    );
  }
}
