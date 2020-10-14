import {
  CommandBus,
  EventBus,
  EventsHandler,
  IEventHandler,
} from '@nestjs/cqrs';
import { ReadyCheckStartedEvent } from '../../gateway/events/ready-check-started.event';
import { Client } from 'discord.js';
import { DeliverReadyCheckCommand } from '../command/DeliverReadyCheck/deliver-ready-check.command';
import {DiscordUserRepository} from "../repository/discord-user.repository";

@EventsHandler(ReadyCheckStartedEvent)
export class ReadyCheckStartedHandler
  implements IEventHandler<ReadyCheckStartedEvent> {
  constructor(
    private client: Client,
    private readonly cbus: CommandBus,
    private readonly ebus: EventBus,
    private readonly discordUserRepository: DiscordUserRepository
  ) {}

  async handle(event: ReadyCheckStartedEvent) {
    const discordUsers = (
      await Promise.all(
        event.entries.map(async t => ({
          entry: t,
          discordId: await this.discordUserRepository.findByPlayerId(t.playerId),
        })),
      )
    ).filter(t => !!t.discordId);


    // ok we launch commands
    discordUsers.forEach(t =>
      this.cbus.execute(
        new DeliverReadyCheckCommand(
          event.mode,
          event.roomId,
          t.discordId.discordId,
          event.entries,
          event.state,
        ),
      ),
    );
  }
}
