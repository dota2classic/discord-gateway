import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';

export class DeleteQueueMessageCommand{
  constructor(public readonly mode: MatchmakingMode) {
  }
}