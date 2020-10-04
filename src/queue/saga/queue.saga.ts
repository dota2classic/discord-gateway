import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { QueueCreatedEvent } from 'gateway/events/queue-created.event';

@Injectable()
export class QueueSaga {
  // @Saga()
  // createQueues = (events$: Observable<any>): Observable<ICommand> => {
  //   return events$.pipe(ofType(QueueCreatedEvent));
  // };
}
