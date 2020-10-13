import { AggregateRoot } from '@nestjs/cqrs';
import { Snowflake } from 'discord.js';
import { ReadyState } from '../../gateway/events/ready-state-received.event';
import { RoomReadyState } from '../../gateway/events/room-ready-check-complete.event';
import { MatchmakingMode } from '../../gateway/shared-types/matchmaking-mode';

export class ReadyCheckModel extends AggregateRoot {
  public readyState: ReadyState = ReadyState.PENDING;

  constructor(
    public readonly userId: Snowflake,
    public readonly messageId: Snowflake,
    public readonly channelId: Snowflake,
    public readonly roomId: string,
    public readonly mode: MatchmakingMode,
    public globalState: RoomReadyState,
  ) {
    super();
  }

  public static id(roomId: string, userId: Snowflake) {
    return roomId + userId;
  }
  public get id() {
    return ReadyCheckModel.id(this.roomId, this.userId);
  }
}
