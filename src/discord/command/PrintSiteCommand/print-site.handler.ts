import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { PrintSiteCommand } from "./print-site.command";
import { Client, Guild, TextChannel } from "discord.js";

@CommandHandler(PrintSiteCommand)
export class PrintSiteHandler implements ICommandHandler<PrintSiteCommand> {

  private readonly logger = new Logger(PrintSiteHandler.name)

  constructor(private readonly client: Client, private readonly guild: Guild) {

  }

  async execute(command: PrintSiteCommand) {
    const ch = this.guild.channels.resolve(command.cid) as TextChannel;

    await ch.send(`https://dota2classic.ru - сам сайт
https://dota2classic.ru/leaderboard - таблица лидеров
https://dota2classic.ru/history - история матчей
https://dota2classic.ru/queue - поиск игры`)
  }

}
