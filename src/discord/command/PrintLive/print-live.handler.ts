import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { PrintLiveCommand } from './print-live.command';
import { createCanvas, loadImage } from 'canvas';
import { Client, TextChannel } from 'discord.js';
import { I18nService } from '../../service/i18n.service';
import { LiveMatchUpdateEvent } from '../../../gateway/events/gs/live-match-update.event';
import { LiveMatchService } from '../../service/live-match.service';

@CommandHandler(PrintLiveCommand)
export class PrintLiveHandler implements ICommandHandler<PrintLiveCommand> {
  private readonly logger = new Logger(PrintLiveHandler.name);

  constructor(
    private readonly client: Client,
    private readonly i18nService: I18nService,
    private readonly ls: LiveMatchService,
  ) {}


  async execute(command: PrintLiveCommand) {
    const channel = (await this.client.channels.resolve(
      command.chid,
    )) as TextChannel;

    const list = this.ls.list()

    await channel.send(this.i18nService.liveMatchPreviewInGame(list));
  }
}
