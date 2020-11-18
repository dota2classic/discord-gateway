import { Snowflake } from "discord.js";

export class LeavePartyCommand {
  constructor(public readonly discordId: Snowflake) {}
}
