import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { Snowflake } from 'discord.js';

export class CreateQueueMessageCommand {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly channel: Snowflake,
  ) {}
}
