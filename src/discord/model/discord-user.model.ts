import {AggregateRoot} from "@nestjs/cqrs";
import {Snowflake} from "discord.js";
import {PlayerId} from "../../gateway/shared-types/player-id";

export class DiscordUserModel extends AggregateRoot {
  constructor(public readonly discordId: Snowflake, public readonly playerId: PlayerId) {
    super();
  }
}