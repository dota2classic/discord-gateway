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
  private finishedMatchesCache = new Map<number, boolean>();

  private readonly entityCache = new Map<number, LiveMatchUpdateEvent>();
  private readonly logger = new Logger(LiveMatchService.name);

  constructor() {
    this.logger.log(`Using delay of ${LIVE_MATCH_DELAY} for live previews`);
  }

  private isMatchComplete(id: number): boolean {
    return this.finishedMatchesCache.get(id) === true;
  }

  public pushEvent(event: LiveMatchUpdateEvent) {
    if (this.isMatchComplete(event.matchId)) return;

    if (!this.cache.has(event.matchId)) {
      // if not subject, we
      const eventStream = new Subject<LiveMatchUpdateEvent>();
      this.cache.set(event.matchId, eventStream);

      eventStream.pipe(delay(LIVE_MATCH_DELAY)).subscribe(e => {
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
      this.finishedMatchesCache.set(id, true);
      this.entityCache.delete(id);
    }
  }

  public list(): LiveMatchUpdateEvent[] {
    return [...this.entityCache.values()].filter(t => !this.isMatchComplete(t.matchId));
  }

  public streamMatch(id: number): Observable<LiveMatchUpdateEvent> {
    const liveOne = this.cache.get(id);

    if (liveOne && !this.isMatchComplete(id)) {
      return concat(
        of(this.entityCache.get(id)),
        liveOne, //.pipe(delay(LIVE_MATCH_DELAY)),
      );
    }

    return of();
  }
}
