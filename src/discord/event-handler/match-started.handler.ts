import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {MatchStartedEvent} from "../../gateway/events/match-started.event";
import {QueueMessageSyncRepository} from "../../queue/repository/queue-message-sync.repository";
import {Client, TextChannel} from "discord.js";
import {I18nService} from "../service/i18n.service";

@EventsHandler(MatchStartedEvent)
export class MatchStartedHandler implements IEventHandler<MatchStartedEvent> {
  constructor(
    private readonly qm: QueueMessageSyncRepository,
    private readonly client: Client,
    private readonly i18n: I18nService
  ) {}

  async handle(event: MatchStartedEvent) {
    // ok here publish "live chat" message
    const sync = await this.qm.get(event.info.mode);
    if(!sync){
      // :thinking:
      return;
    }
    const ch = (await this.client.channels.resolve(sync.channelID)) as TextChannel;
    await ch.send(
      this.i18n.liveMatch(event.info, event.matchId, event.gsInfo)
    )
    // and launch deliver connect message for each discord user
  }
}
