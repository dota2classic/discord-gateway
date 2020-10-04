import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';

class QueueEntry {
  constructor(public readonly id: string, public readonly isDiscord: boolean) {}
}

export class UpdateQueueMessageCommand {
  constructor(public readonly mode: MatchmakingMode, public readonly entries: QueueEntry[] ) {}
}
