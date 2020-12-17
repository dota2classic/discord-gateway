import { Injectable, Logger } from '@nestjs/common';
import { concat, Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LIVE_MATCH_DELAY } from "../../config/env";
import { LiveMatchUpdateEvent } from "../../gateway/events/gs/live-match-update.event";

@Injectable()
export class LiveMatchService {
  // MINUTE DELAY
  // matchID key => events
  private cache = new Map<number, Subject<LiveMatchUpdateEvent>>();
  private readCache = new Map<number, Observable<LiveMatchUpdateEvent>>();

  private readonly entityCache = new Map<number, LiveMatchUpdateEvent>();
  private readonly logger = new Logger(LiveMatchService.name);

  constructor() {
    this.logger.log(`Using delay of ${LIVE_MATCH_DELAY} for live previews`);
  }

  public pushEvent(event: LiveMatchUpdateEvent) {
    if (!this.cache.has(event.matchId)) {
      // if not subject, we
      const eventStream = new Subject<LiveMatchUpdateEvent>();
      this.cache.set(event.matchId, eventStream);
      const delayedStream = eventStream.pipe(delay(LIVE_MATCH_DELAY));
      this.readCache.set(event.matchId, delayedStream);

      delayedStream.subscribe(e => {
        console.log('Updated ecache live matches');
        this.entityCache.set(e.matchId, e);
      });
    }

    this.cache.get(event.matchId).next(event);
  }

  public onStop(id: number) {
    const sub = this.cache.get(id);
    if (sub) {
      sub.complete();
      this.cache.delete(id);
      this.readCache.delete(id);
      this.entityCache.delete(id);
    }
  }

  liveMatch() {
    return [...this.entityCache.values()][0]
  }
}
