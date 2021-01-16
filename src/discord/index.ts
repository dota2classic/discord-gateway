import {CommandsSaga} from 'discord/saga/commands.saga';
import {DiscordSaga} from 'discord/saga/discord.saga';
import {ListenQueueMessageHandler} from 'discord/command/ListenQueueMessage/listen-queue-message.handler';
import {EmojiService} from 'discord/service/emoji.service';
import {QueueUpdatedHandler} from 'discord/event-handler/queue-updated.handler';
import {UpdateQueueMessageHandler} from 'discord/command/UpdateQueueMessage/update-queue-message.handler';
import {DiscordService} from 'discord/service/discord.service';
import {DeliverReadyCheckHandler} from './command/DeliverReadyCheck/deliver-ready-check.handler';
import {ReadyCheckRepository} from './repository/ready-check.repository';
import {ReadyCheckStartedHandler} from './event-handler/ready-check-started.handler';
import {ReadyCheckService} from './service/ready-check.service';
import {ReadyStateUpdatedHandler} from './event-handler/ready-state-updated.handler';
import {DiscordUserRepository} from './repository/discord-user.repository';
import {DiscordEnterQueueHandler} from './event-handler/discord-enter-queue.handler';
import {DiscordLeaveQueueHandler} from './event-handler/discord-leave-queue.handler';
import {UserConnectionCreatedHandler} from './event-handler/user-connection-created.event';
import {MatchStartedHandler} from "./event-handler/match-started.handler";
import {LiveMatchRepository} from "./repository/live-match.repository";
import {MatchFinishedHandler} from "./event-handler/match-finished.handler";
import {SetChannelHandler} from "./command/SetChannel/set-channel.handler";
import {AnnounceMatchFinishedHandler} from "./event-handler/announce-match-finished.handler";
import {GameServerStartedHandler} from "./event-handler/game-server-started.handler";
import { RoomNotReadyHandler } from "./event-handler/room-not-ready.handler";
import { PartyInviteCreatedHandler } from "./event-handler/party-invite-created.handler";
import { PartyInviteExpiredHandler } from "./event-handler/party-invite-expired.handler";
import { PrintPartyHandler } from "./command/PrintParty/print-party.handler";
import { LeavePartyHandler } from "./command/LeaveParty/leave-party.handler";
import { InviteToPartyHandler } from "./command/InviteToParty/invite-to-party.handler";
import { PrintStatsHandler } from "./command/PrintStats/print-stats.handler";
import { PartyInviteResultHandler } from "./event-handler/party-invite-result.handler";
import { EngageNeededHandler } from "./event-handler/engage-needed.handler";
import { EnterQueueDeclinedHandler } from "./event-handler/enter-queue-declined.handler";
import { PrintHelpHandler } from "./command/PrintHelp/print-help.handler";
import { PrintLiveHandler } from "./command/PrintLive/print-live.handler";
import { LiveMatchUpdateHandler } from "./event-handler/live-match-update.handler";
import { LiveMatchService } from "./service/live-match.service";
import { MatchFinishedLiveCloseHandler } from "./event-handler/match-finished-live-close.handler";
import { DiscordNewMemberHandler } from "./event-handler/discord-new-member.handler";
import { FullHelpRequestedHandler } from "./event-handler/full-help-requested.event";
import { PrintSiteHandler } from "./command/PrintSiteCommand/print-site.handler";
import { EnterRankedQueueDeclinedHandler } from "./event-handler/enter-ranked-queue-declined.handler";
import { SyncRolesHandler } from "./command/SyncRoles/sync-roles.handler";

const Sagas = [CommandsSaga, DiscordSaga];
const EventHandlers = [
  QueueUpdatedHandler,
  ReadyStateUpdatedHandler,
  ReadyCheckStartedHandler,
  DiscordEnterQueueHandler,
  DiscordLeaveQueueHandler,
  UserConnectionCreatedHandler,

  MatchStartedHandler,
  MatchFinishedHandler,
  AnnounceMatchFinishedHandler,
  GameServerStartedHandler,

  RoomNotReadyHandler,
  PartyInviteCreatedHandler,
  PartyInviteExpiredHandler,
  PartyInviteResultHandler,

  EngageNeededHandler,
  EnterQueueDeclinedHandler,
  EnterRankedQueueDeclinedHandler,

  LiveMatchUpdateHandler,
  MatchFinishedLiveCloseHandler,

  DiscordNewMemberHandler,
  FullHelpRequestedHandler
];
const Repositories = [
  ReadyCheckRepository,
  DiscordUserRepository,
  LiveMatchRepository,
];

const CommandHandlers = [
  ListenQueueMessageHandler,
  UpdateQueueMessageHandler,
  DeliverReadyCheckHandler,
  SetChannelHandler,
  PrintPartyHandler,
  LeavePartyHandler,
  InviteToPartyHandler,
  PrintStatsHandler,
  PrintHelpHandler,
  PrintLiveHandler,
  PrintSiteHandler,

  SyncRolesHandler
];
export const DiscordProviders = [
  ...CommandHandlers,
  ...Sagas,
  ...EventHandlers,
  ...Repositories,
  EmojiService,
  ReadyCheckService,
  DiscordService,
  LiveMatchService
];
