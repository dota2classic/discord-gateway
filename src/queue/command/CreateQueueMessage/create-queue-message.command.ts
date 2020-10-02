import { MatchmakingMode } from 'src/gateway/shared-types/matchmaking-mode';
import { Snowflake } from 'discord.js';

export class CreateQueueMessageCommand {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly channel: Snowflake,
  ) {}
}
