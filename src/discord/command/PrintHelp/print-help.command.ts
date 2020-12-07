import { Snowflake } from 'discord.js';

export class PrintHelpCommand {
  constructor(public readonly channelId: Snowflake) {}
}
