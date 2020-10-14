import { MatchmakingMode } from '../../gateway/shared-types/matchmaking-mode';
import { Snowflake } from 'discord.js';

export class DiscordLeaveQueueEvent {
  constructor(
    public readonly discordId: Snowflake,
    public readonly mode: MatchmakingMode,
  ) {}
}
