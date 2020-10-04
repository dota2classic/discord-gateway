import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { Snowflake } from 'discord.js';


@Entity()
export class QueueMessageModel {
  @PrimaryColumn()
  mode: MatchmakingMode;

  @Column()
  messageID: Snowflake;

  @Column()
  channelID: Snowflake;
}
