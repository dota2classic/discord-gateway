import {CommandBus, EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {DiscordEnterQueueEvent} from '../event/discord-enter-queue.event';
import {DiscordUserRepository} from '../repository/discord-user.repository';
import {PlayerEnterQueueCommand} from "../../gateway/commands/player-enter-queue.command";

@EventsHandler(DiscordEnterQueueEvent)
export class DiscordEnterQueueHandler
  implements IEventHandler<DiscordEnterQueueEvent> {
  constructor(
    private readonly discordUserRepository: DiscordUserRepository,
    private readonly cbus: CommandBus,
  ) {}

  async handle(event: DiscordEnterQueueEvent) {
    const player = this.discordUserRepository.get(event.discordId);

    if (!player) {
      // todo: emit event that no steam attached
      return;
    }

    await this.cbus.execute(
      new PlayerEnterQueueCommand(player.playerId, event.mode),
    );
  }
}
