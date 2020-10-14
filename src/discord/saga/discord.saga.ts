import {Injectable} from '@nestjs/common';
import {ICommand, ofType, Saga} from '@nestjs/cqrs';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ListenQueueMessageCommand} from 'discord/command/ListenQueueMessage/listen-queue-message.command';
import {QueueMessageCreatedEvent} from 'queue/event/queue-message-created.event';
import {QueueUpdateReceivedEvent} from 'discord/event/queue-update-received.event';
import {UpdateQueueMessageCommand} from 'discord/command/UpdateQueueMessage/update-queue-message.command';

@Injectable()
export class DiscordSaga {
  @Saga()
  listenReactions = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(QueueMessageCreatedEvent),
      map(e => new ListenQueueMessageCommand(e.mode, e.messageID, e.channelID)),
    );
  };

  @Saga()
  updateQM = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(QueueUpdateReceivedEvent),
      map(e => new UpdateQueueMessageCommand(e.mode, e.entries)),
    );
  };
}
