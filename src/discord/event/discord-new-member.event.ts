import { Snowflake } from 'discord.js';

export class DiscordNewMemberEvent {
  constructor(public readonly id: Snowflake) {}
}
