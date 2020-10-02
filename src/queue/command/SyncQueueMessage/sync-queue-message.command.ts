import { MatchmakingMode } from 'src/gateway/shared-types/matchmaking-mode';
import { Snowflake } from 'discord.js';

export class SyncQueueMessageCommand {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly channelID: Snowflake,
    public readonly messageID: Snowflake,
  ) {}
}
