import { Injectable } from '@nestjs/common';
import { RuntimeRepository } from '../../config/runtime-repository';
import { EventPublisher } from '@nestjs/cqrs';
import { DiscordUserModel } from '../model/discord-user.model';
import { PlayerId } from '../../gateway/shared-types/player-id';

@Injectable()
export class DiscordUserRepository extends RuntimeRepository<
  DiscordUserModel,
  'discordId'
> {
  constructor(publisher: EventPublisher) {
    super(publisher);
  }

  public findByPlayerId(pid: PlayerId) {
    return this.values.find(t => t.playerId.value === pid.value);
  }
}