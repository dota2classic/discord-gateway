import { Snowflake } from "discord.js";

export class FullHelpRequestedEvent {
  constructor(public readonly id: Snowflake) {
  }
}
