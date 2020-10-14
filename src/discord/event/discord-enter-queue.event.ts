import { MatchmakingMode } from '../../gateway/shared-types/matchmaking-mode';
import { Snowflake } from 'discord.js';

export class DiscordEnterQueueEvent {
  constructor(
    public readonly discordId: Snowflake,
    public readonly mode: MatchmakingMode,
  ) {}
}
