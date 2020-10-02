import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MatchmakingMode } from 'src/gateway/shared-types/matchmaking-mode';
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
