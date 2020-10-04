import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { Snowflake } from 'discord.js';
import { AggregateRoot } from '@nestjs/cqrs';

export class QueueMessageSyncModel extends AggregateRoot {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly messageID: Snowflake,
    public readonly channelID: Snowflake,
  ) {
    super()
  }
}
