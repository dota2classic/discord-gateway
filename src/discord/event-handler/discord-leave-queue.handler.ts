import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DiscordEnterQueueEvent } from '../event/discord-enter-queue.event';
import { DiscordUserRepository } from '../repository/discord-user.repository';
import {PlayerEnterQueueCommand} from "../../gateway/commands/player-enter-queue.command";
import {inspect} from "util";
import {DiscordLeaveQueueEvent} from "../event/discord-leave-queue.event";
import {PlayerLeaveQueueCommand} from "../../gateway/commands/player-leave-queue.command";

@EventsHandler(DiscordLeaveQueueEvent)
export class DiscordLeaveQueueHandler
  implements IEventHandler<DiscordLeaveQueueEvent> {
  constructor(
    private readonly discordUserRepository: DiscordUserRepository,
    private readonly cbus: CommandBus,
  ) {}

  async handle(event: DiscordLeaveQueueEvent) {
    const player = this.discordUserRepository.get(event.discordId);

    if (!player) {
      // todo: emit event that no steam attached
      return;
    }
    await this.cbus.execute(new PlayerLeaveQueueCommand(player.playerId, event.mode))
  }
}
