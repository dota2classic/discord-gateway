import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListenQueueMessageCommand } from 'discord/command/ListenQueueMessage/listen-queue-message.command';
import { QueueMessageCreatedEvent } from 'queue/event/queue-message-created.event';

@Injectable()
export class DiscordSaga {
  @Saga()
  listenReactions = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(QueueMessageCreatedEvent),
      map(e => new ListenQueueMessageCommand(e.mode, e.messageID, e.channelID)),
    );
  };
}
