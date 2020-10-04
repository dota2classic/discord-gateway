import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';

export class MessageMissingEvent {
  constructor(public readonly mode: MatchmakingMode) {}
}
