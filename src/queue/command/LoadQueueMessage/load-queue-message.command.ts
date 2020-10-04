import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';

export class LoadQueueMessageCommand {
  constructor(public readonly mode: MatchmakingMode) {
  }
}