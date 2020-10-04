import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { QueueCreatedEvent } from 'gateway/events/queue-created.event';
import { QueueMessageCreatedEvent } from 'queue/event/queue-message-created.event';
import { SyncQueueMessageCommand } from 'queue/command/SyncQueueMessage/sync-queue-message.command';
import { map, mergeMap } from 'rxjs/operators';
import { MicroserviceStartedEvent } from 'queue/event/microservice-started.event';
import { LoadQueueMessageCommand } from 'queue/command/LoadQueueMessage/load-queue-message.command';
import { MatchmakingModes } from 'gateway/shared-types/matchmaking-mode';

@Injectable()
export class QueueSaga {
  @Saga()
  createQueues = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(QueueMessageCreatedEvent),
      map(e => new SyncQueueMessageCommand(e.mode, e.channelID, e.messageID)),
    );
  };


  @Saga()
  microserviceStarted = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(MicroserviceStartedEvent),
      mergeMap(e => MatchmakingModes.map(t => new LoadQueueMessageCommand(t))),
    );
  };
}
