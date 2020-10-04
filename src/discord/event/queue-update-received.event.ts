import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';

export class QueueEntry {
  constructor(public readonly id: string, public readonly isDiscord: boolean) {}
}

export class QueueUpdateReceivedEvent {
  constructor(public readonly mode: MatchmakingMode, public readonly entries: QueueEntry[]) {}
}
