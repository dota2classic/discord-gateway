import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import {PlayerId} from "../../../gateway/shared-types/player-id";

class QueueEntry {
  constructor(public readonly id: PlayerId, public readonly isDiscord: boolean) {}
}

export class UpdateQueueMessageCommand {
  constructor(public readonly mode: MatchmakingMode, public readonly entries: QueueEntry[] ) {}
}
