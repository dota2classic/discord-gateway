import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LogEvent } from '../../gateway/events/log.event';
import { Client } from 'discord.js';
import { dmItachi } from '../../util/dmItachi';

@EventsHandler(LogEvent)
export class LogHandler implements IEventHandler<LogEvent> {
  constructor(private client: Client) {}

  async handle(event: LogEvent) {
    await dmItachi(this.client, event.text);
  }
}
