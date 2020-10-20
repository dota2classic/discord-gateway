import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {MatchStartedEvent} from "../../gateway/events/match-started.event";
import {QueueMessageSyncRepository} from "../../queue/repository/queue-message-sync.repository";
import {Client, TextChannel} from "discord.js";
import {I18nService} from "../service/i18n.service";
import {LiveMatchRepository} from "../repository/live-match.repository";
import {LiveMatchModel} from "../model/live-match.model";

@EventsHandler(MatchStartedEvent)
export class MatchStartedHandler implements IEventHandler<MatchStartedEvent> {
  constructor(
    private readonly qm: QueueMessageSyncRepository,
    private readonly client: Client,
    private readonly i18n: I18nService,
    private readonly liveMatchRepo: LiveMatchRepository,
  ) {}

  async handle(event: MatchStartedEvent) {
    // ok here publish "live chat" message
    const sync = await this.qm.get(event.info.mode);
    if (!sync) {
      // :thinking:
      return;
    }
    const ch = (await this.client.channels.resolve(
      sync.channelID,
    )) as TextChannel;
    const msg = await ch.send(
      this.i18n.liveMatch(event.info, event.matchId, event.gsInfo),
    );

    const m = new LiveMatchModel(event.matchId, msg.id, msg.channel.id);
    await this.liveMatchRepo.save(m.matchId, m);
    // and launch deliver connect message for each discord user
  }
}
