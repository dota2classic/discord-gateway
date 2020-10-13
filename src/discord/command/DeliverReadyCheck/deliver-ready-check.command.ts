import { Snowflake } from 'discord.js';
import { MatchmakingMode } from '../../../gateway/shared-types/matchmaking-mode';
import {ReadyCheckEntry, RoomReadyState} from '../../../gateway/events/room-ready-check-complete.event';

export class DeliverReadyCheckCommand {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly roomID: string,
    public readonly discordID: Snowflake,
    public readonly entries: ReadyCheckEntry[],
    public readonly state: RoomReadyState,
  ) {}
}
