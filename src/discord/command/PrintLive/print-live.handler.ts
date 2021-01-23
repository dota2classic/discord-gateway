import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { PrintLiveCommand } from './print-live.command';
import { createCanvas, loadImage } from 'canvas';
import { Client, TextChannel } from 'discord.js';
import { I18nService } from '../../service/i18n.service';
import { LiveMatchUpdateEvent } from '../../../gateway/events/gs/live-match-update.event';
import { LiveMatchService } from '../../service/live-match.service';
import { DiscordUserRepository } from '../../repository/discord-user.repository';
import heroName from '../../service/util/heroName';

@CommandHandler(PrintLiveCommand)
export class PrintLiveHandler implements ICommandHandler<PrintLiveCommand> {
  private readonly logger = new Logger(PrintLiveHandler.name);

  constructor(
    private readonly client: Client,
    private readonly i18nService: I18nService,
    private readonly ls: LiveMatchService,
    private readonly userRepository: DiscordUserRepository,
  ) {}

  async execute(command: PrintLiveCommand) {
    const channel = (await this.client.channels.resolve(
      command.chid,
    )) as TextChannel;

    const list = this.ls.list();

    if (command.mention) {
      const duser = this.userRepository.get(command.mention);

      const d = await this.client.users.resolve(duser.discordId);

      if (!duser) {
        await channel.send(this.i18nService.notFoundAccount());
        return;
      }

      const liveMatch = list.find(
        t => !!t.heroes.find(z => z.steam_id === duser.playerId.value),
      );

      if (liveMatch) {
        const hero = liveMatch.heroes.find(
          t => t.steam_id === duser.playerId.value,
        ).hero;

        await channel.send(
          `${d.username} сейчас играет на ${heroName(
            hero,
          )}. Ссылка на матч: https://dota2classic.ru/match/${
            liveMatch.matchId
          }`,
        );
      } else {
        await channel.send(`${d.username} сейчас не играет`);
      }
    } else {
      await channel.send(this.i18nService.liveMatchPreviewInGame(list));
    }
  }
}
