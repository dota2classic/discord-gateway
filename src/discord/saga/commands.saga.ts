import { Injectable } from '@nestjs/common';
import { filter, map, tap } from 'rxjs/operators';
import { EventBus, ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { Client, Message } from 'discord.js';
import { DiscordMessageEvent } from 'src/discord/event/discord-message.event';
import { CreateQueueMessageCommand } from 'src/queue/command/CreateQueueMessage/create-queue-message.command';
import { MatchmakingMode } from 'src/gateway/shared-types/matchmaking-mode';

const commandDeletion = tap<DiscordMessageEvent>(it =>
  it.message
    .delete()
    .catch(() => console.error(`Can't delete command message`)),
);

@Injectable()
export class CommandsSaga {
  constructor(
    private readonly client: Client,
    private readonly ebus: EventBus,
  ) {
    this.client.on('message', (msg: Message) =>
      ebus.publish(new DiscordMessageEvent(msg)),
    );
  }

  @Saga()
  createQueues = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!queue')),
      commandDeletion,
      map(it => {
        const mode: MatchmakingMode = parseInt(
          it.message.cleanContent.replace('!queue ', ''),
        );
        return new CreateQueueMessageCommand(mode, it.message.channel.id);
      }),
    );

  };
}
