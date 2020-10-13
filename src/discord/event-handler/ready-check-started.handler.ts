import {CommandBus, EventBus, EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {ReadyCheckStartedEvent} from "../../gateway/events/ready-check-started.event";
import {Client} from "discord.js";
import {ReadyCheckService} from "../service/ready-check.service";
import {DeliverReadyCheckCommand} from "../command/DeliverReadyCheck/deliver-ready-check.command";

@EventsHandler(ReadyCheckStartedEvent)
export class ReadyCheckStartedHandler
  implements IEventHandler<ReadyCheckStartedEvent> {
  constructor(
    private client: Client,
    private readonly cbus: CommandBus,
    private readonly ebus: EventBus,
  ) {}

  async handle(event: ReadyCheckStartedEvent) {
    const discordUsers = event.entries.filter(t =>
      this.client.users.cache.get(t.playerId),
    );

    // ok we launch commands
    discordUsers.forEach(t =>
      this.cbus.execute(
        new DeliverReadyCheckCommand(
          event.mode,
          event.roomId,
          t.playerId,
          event.entries,
          event.state,
        ),
      ),
    );
  }
}
