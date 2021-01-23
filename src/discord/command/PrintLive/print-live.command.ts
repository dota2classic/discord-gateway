import { Snowflake } from "discord.js";

export class PrintLiveCommand {
  constructor(public readonly chid: Snowflake, public readonly mention?: Snowflake) {
  }
}
