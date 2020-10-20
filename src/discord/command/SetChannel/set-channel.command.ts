import {ChannelType} from "../../model/channel.model";
import {Snowflake} from "discord.js";

export class SetChannelCommand {
  constructor(public readonly type: ChannelType, public readonly channelId: Snowflake) {
  }
}