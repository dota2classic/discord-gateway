import { PlayerId } from '../../../gateway/shared-types/player-id';
import { Snowflake } from 'discord.js';

export class PrintPartyCommand {
  constructor(public readonly discordId: Snowflake) {}
}
