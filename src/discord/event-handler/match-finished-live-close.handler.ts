import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MatchFinishedEvent } from '../../gateway/events/match-finished.event';
import { LiveMatchService } from "../service/live-match.service";

@EventsHandler(MatchFinishedEvent)
export class MatchFinishedLiveCloseHandler implements IEventHandler<MatchFinishedEvent> {
  constructor(private readonly ls: LiveMatchService) {}

  async handle(event: MatchFinishedEvent) {
    this.ls.onStop(event.matchId);
  }
}
