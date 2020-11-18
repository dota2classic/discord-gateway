import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { PrintPartyCommand } from './print-party.command';
import { GetPartyQuery } from '../../../gateway/queries/GetParty/get-party.query';
import { GetPartyQueryResult } from '../../../gateway/queries/GetParty/get-party-query.result';
import { Client } from 'discord.js';
import { DiscordUserRepository } from '../../repository/discord-user.repository';
import { I18nService } from '../../service/i18n.service';
import { GetUserInfoQuery } from '../../../gateway/queries/GetUserInfo/get-user-info.query';
import { GetUserInfoQueryResult } from '../../../gateway/queries/GetUserInfo/get-user-info-query.result';

@CommandHandler(PrintPartyCommand)
export class PrintPartyHandler implements ICommandHandler<PrintPartyCommand> {
  private readonly logger = new Logger(PrintPartyHandler.name);

  constructor(
    private readonly qbus: QueryBus,
    private readonly client: Client,
    private readonly i18n: I18nService,
    private readonly urep: DiscordUserRepository,
  ) {}

  async execute(command: PrintPartyCommand) {
    const du = await this.client.users.resolve(command.discordId);

    const user = this.urep.get(command.discordId);
    if (!user) {
      du.send(this.i18n.noDiscordAttachment());
      return;
    }

    const res = await this.qbus.execute<GetPartyQuery, GetPartyQueryResult>(
      new GetPartyQuery(user.playerId),
    );

    if (!res) return;

    const players = await Promise.all(
      res.players.map(async p => {
        const duser = this.urep.findByPlayerId(p);
        const isLeader = p.value === res.leader.value;
        if (duser) {
          return {
            view: `<@${duser.discordId}>`,
            leader: isLeader
          };
        } else {
          const info = await this.qbus.execute<
            GetUserInfoQuery,
            GetUserInfoQueryResult
          >(new GetUserInfoQuery(p));
          if (info) {
            return {
              view: info.name || info.id.value,
              leader: isLeader
            };
          } else {
            return {
              view: info.id.value,
              leader: isLeader
            };
          }
        }
      }),
    );

    await du.send(this.i18n.printParty(players, res.leader))
  }
}
