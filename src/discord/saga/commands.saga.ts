import { Injectable } from "@nestjs/common";
import { filter, map, tap } from "rxjs/operators";
import { EventBus, ICommand, ofType, Saga } from "@nestjs/cqrs";
import { Observable } from "rxjs";
import { Client, Message, Snowflake } from "discord.js";
import { DiscordMessageEvent } from "discord/event/discord-message.event";
import { CreateQueueMessageCommand } from "queue/command/CreateQueueMessage/create-queue-message.command";
import { MatchmakingMode } from "gateway/shared-types/matchmaking-mode";
import { SetChannelCommand } from "../command/SetChannel/set-channel.command";
import { ChannelType } from "../model/channel.model";
import { PrintPartyCommand } from "../command/PrintParty/print-party.command";
import { LeavePartyCommand } from "../command/LeaveParty/leave-party.command";
import { InviteToPartyCommand } from "../command/InviteToParty/invite-to-party.command";
import { PrintStatsCommand } from "../command/PrintStats/print-stats.command";
import { PrintHelpCommand } from "../command/PrintHelp/print-help.command";
import { PrintLiveCommand } from "../command/PrintLive/print-live.command";
import { DiscordNewMemberEvent } from "../event/discord-new-member.event";
import { FullHelpRequestedEvent } from "../event/full-help-requested.event";
import { PrintSiteCommand } from "../command/PrintSiteCommand/print-site.command";

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

    this.client.on('guildMemberAdd', member => {
      ebus.publish(new DiscordNewMemberEvent(member.user.id));
    });
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

  @Saga()
  setChannel = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!setchannel')),
      commandDeletion,
      map(it => {
        const type: ChannelType = parseInt(
          it.message.cleanContent.replace('!setchannel ', ''),
        );
        return new SetChannelCommand(type, it.message.channel.id);
      }),
    );
  };

  @Saga()
  viewParty = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!party')),
      commandDeletion,
      map(it => new PrintPartyCommand(it.message.author.id)),
    );
  };

  @Saga()
  unParty = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!unparty')),
      commandDeletion,
      map(it => new LeavePartyCommand(it.message.author.id)),
    );
  };

  @Saga()
  inviteToParty = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!invite')),
      commandDeletion,
      map(it => {
        const invited: Snowflake | undefined = [
          ...it.message.mentions.users.values(),
        ].map(t => t.id)[0];
        return new InviteToPartyCommand(it.message.author.id, invited);
      }),
    );
  };

  @Saga()
  stats = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!stats')),
      commandDeletion,
      map(it => {
        const mentioned: Snowflake | undefined = [
          ...it.message.mentions.users.values(),
        ].map(t => t.id)[0];
        return new PrintStatsCommand(
          it.message.channel.id,
          mentioned || it.message.author.id,
          false,
        );
      }),
    );
  };

  @Saga()
  profile = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!profile')),
      commandDeletion,
      map(it => {
        const mentioned: Snowflake | undefined = [
          ...it.message.mentions.users.values(),
        ].map(t => t.id)[0];
        return new PrintStatsCommand(
          it.message.channel.id,
          mentioned || it.message.author.id,
          true,
        );
      }),
    );
  };

  @Saga()
  help = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!help')),
      commandDeletion,
      map(it => new PrintHelpCommand(it.message.channel.id)),
    );
  };

  @Saga()
  testjoin = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!testjoin')),
      tap((e: DiscordMessageEvent) =>
        this.ebus.publish(new DiscordNewMemberEvent(e.message.author.id)),
      ),
    );
  };


  @Saga()
  fullHelp = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      // dm only
      filter(it => it.message.cleanContent.startsWith('!помощь') && it.message.channel.type === "dm"),
      tap((e: DiscordMessageEvent) =>
        this.ebus.publish(new FullHelpRequestedEvent(e.message.author.id)),
      ),
    );
  };

  @Saga()
  livePreview = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!live')),
      commandDeletion,
      map(it => {

        const mentioned: Snowflake | undefined = [
          ...it.message.mentions.users.values(),
        ].map(t => t.id)[0];
        return new PrintLiveCommand(
          it.message.channel.id,
          mentioned
        );
      }),
    );
  };

  @Saga()
  siteInfo = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DiscordMessageEvent),
      filter(it => it.message.cleanContent.startsWith('!site')),
      commandDeletion,
      map(it => new PrintSiteCommand(it.message.channel.id)),
    );
  };
}
