import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { PartyInviteCreatedEvent } from '../../gateway/events/party/party-invite-created.event';
import { GetUserInfoQuery } from '../../gateway/queries/GetUserInfo/get-user-info.query';
import { GetUserInfoQueryResult } from '../../gateway/queries/GetUserInfo/get-user-info-query.result';
import { Client } from 'discord.js';
import { DiscordUserRepository } from '../repository/discord-user.repository';
import { DiscordService } from "../service/discord.service";

@EventsHandler(PartyInviteCreatedEvent)
export class PartyInviteCreatedHandler
  implements IEventHandler<PartyInviteCreatedEvent> {
  constructor(
    private readonly client: Client,
    private readonly queryBus: QueryBus,
    private readonly userRep: DiscordUserRepository,
    private readonly discordService: DiscordService
  ) {}

  async handle(event: PartyInviteCreatedEvent) {
    const res = await this.queryBus.execute<
      GetUserInfoQuery,
      GetUserInfoQueryResult
    >(new GetUserInfoQuery(event.leaderId));

    const u = this.userRep.findByPlayerId(event.invited);
    if (!u) return;


    const inviter = this.userRep.findByPlayerId(event.leaderId)

    const user = this.client.users.resolve(u.discordId);
    await this.discordService.partyInvite(user, inviter, res, event)
  }
}
