import { Snowflake } from "discord.js";

export class InviteToPartyCommand {
  constructor(public readonly inviter: Snowflake, public readonly invited?: Snowflake) {
  }
}