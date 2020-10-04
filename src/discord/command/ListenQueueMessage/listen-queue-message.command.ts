import { Snowflake } from 'discord.js';
import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';

export class ListenQueueMessageCommand {
  constructor(public readonly mode: MatchmakingMode,  public readonly channelID: Snowflake, public readonly messageID: Snowflake) {
  }
}