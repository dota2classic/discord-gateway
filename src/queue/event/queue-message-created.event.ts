import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { Snowflake } from 'discord.js';

export class QueueMessageCreatedEvent {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly channelID: Snowflake,
    public readonly messageID: Snowflake,
  ) {}
}
