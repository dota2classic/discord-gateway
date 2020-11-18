import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { InviteToPartyCommand } from "./invite-to-party.command";
import { Client } from "discord.js";
import { I18nService } from "../../service/i18n.service";
import { DiscordUserRepository } from "../../repository/discord-user.repository";
import { PartyInviteRequestedEvent } from "../../../gateway/events/party/party-invite-requested.event";

@CommandHandler(InviteToPartyCommand)
export class InviteToPartyHandler
  implements ICommandHandler<InviteToPartyCommand> {
  private readonly logger = new Logger(InviteToPartyHandler.name);

  constructor(
    private readonly ebus: EventBus,
    private readonly client: Client,
    private readonly i18n: I18nService,
    private readonly urep: DiscordUserRepository,
  ) {}

  async execute(command: InviteToPartyCommand) {
    const du = await this.client.users.resolve(command.inviter);

    if (!command.invited) {
      du.send(
        `Чтобы пригласить в группу игрока, его нужно отметить, например, так <@${command.inviter}>`,
      );
      return;
    }

    const user = this.urep.get(command.inviter);
    if (!user) {
      du.send(this.i18n.noDiscordAttachment());
      return;
    }

    const invitedDiscord = this.urep.get(command.invited);
    if (!invitedDiscord) {
      du.send(
        `Discord аккаунт, который Вы приглашаете, не привязан к steam аккаунту! Скажите другу, чтобы привязал его на сайте https://dota2classic.ru`,
      );
      return;
    }

    this.ebus.publish(new PartyInviteRequestedEvent(user.playerId, invitedDiscord.playerId))
  }
}
