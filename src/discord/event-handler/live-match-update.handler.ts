import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LiveMatchUpdateEvent } from '../../gateway/events/gs/live-match-update.event';
import { LiveMatchService } from "../service/live-match.service";

@EventsHandler(LiveMatchUpdateEvent)
export class LiveMatchUpdateHandler
  implements IEventHandler<LiveMatchUpdateEvent> {
  constructor(
    private readonly ls: LiveMatchService,
  ) {}

  async handle(event: LiveMatchUpdateEvent) {
    console.log("Yeah bpy")
    this.ls.pushEvent(event);
  }
}
