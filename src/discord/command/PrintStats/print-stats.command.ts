import { Snowflake } from "discord.js";

export class PrintStatsCommand {
  constructor(public readonly channel: Snowflake, public readonly discordId: string) {
  }
}