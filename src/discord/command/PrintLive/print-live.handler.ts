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

  private async test(evt: LiveMatchUpdateEvent) {
    const canvas = createCanvas(450, 450);

    const ctx = canvas.getContext('2d');

    const map = await loadImage('https://dota2classic.ru/api/static/map.png');
    ctx.drawImage(map, 0, 0, 450, 450);

    for (const hero of evt.heroes) {
      const img = await loadImage(
        `https://dota2classic.ru/api/static/heroes/${hero.hero}.jpg`,
      );
      // left: ${p => p.x * 100}%;
      // bottom: ${p => p.y * 100}%;
      const x = hero.pos_x * 450;
      const y = hero.pos_y * 450;
      ctx.drawImage(img, x, y, 40, 30);
    }
    const buffer = canvas.toBuffer('image/png');
    // fs.writeFileSync('./dist/image.png', buffer);
    // console.log('done');

    return buffer;
  }

  async execute(command: PrintLiveCommand) {
    const channel = (await this.client.channels.resolve(
      command.chid,
    )) as TextChannel;

    const liveMatch = this.ls.liveMatch();

    if (!liveMatch) {
      await channel.send(`Сейчас не идет ни одной игры`);
      return;
    }
    const b = await this.test(liveMatch);

    await channel.send(this.i18nService.liveMatchPreviewInGame(b, liveMatch));
  }
}
