import {AggregateRoot} from "@nestjs/cqrs";
import {Snowflake} from "discord.js";

export class LiveMatchModel extends AggregateRoot {
  constructor(public readonly matchId: number, public readonly messageId: Snowflake, public readonly channelId: Snowflake) {
    super();
  }
}