import {Snowflake} from "discord.js";
import {Column, Entity, PrimaryColumn} from "typeorm";


export enum ChannelType {
  CHAT,
  LIVE
}


@Entity()
export class ChannelModel  {

  @PrimaryColumn()
  public type: ChannelType


  @Column()
  public channelId: Snowflake
}