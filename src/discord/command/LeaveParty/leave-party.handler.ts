import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { LeavePartyCommand } from './leave-party.command';
import { Client } from 'discord.js';
import { I18nService } from '../../service/i18n.service';
import { DiscordUserRepository } from '../../repository/discord-user.repository';
import { PartyLeaveRequestedEvent } from '../../../gateway/events/party/party-leave-requested.event';

@CommandHandler(LeavePartyCommand)
export class LeavePartyHandler implements ICommandHandler<LeavePartyCommand> {
  private readonly logger = new Logger(LeavePartyHandler.name);

  constructor(
    private readonly ebus: EventBus,
    private readonly client: Client,
    private readonly i18n: I18nService,
    private readonly urep: DiscordUserRepository,
  ) {}

  async execute(command: LeavePartyCommand) {
    const du = await this.client.users.resolve(command.discordId);

    const user = this.urep.get(command.discordId);
    if (!user) {
      du.send(this.i18n.noDiscordAttachment());
      return;
    }

    this.ebus.publish(new PartyLeaveRequestedEvent(user.playerId));
  }
}
