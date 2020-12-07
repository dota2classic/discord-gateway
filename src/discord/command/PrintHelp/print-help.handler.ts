import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { PrintHelpCommand } from "./print-help.command";
import { Client, TextChannel } from "discord.js";
import { I18nService } from "../../service/i18n.service";

@CommandHandler(PrintHelpCommand)
export class PrintHelpHandler implements ICommandHandler<PrintHelpCommand> {
  private readonly logger = new Logger(PrintHelpHandler.name);

  constructor(private readonly client: Client, private readonly i18n: I18nService) {}

  async execute(command: PrintHelpCommand) {
    const channel = (await this.client.channels.resolve(
      command.channelId,
    )) as TextChannel;


    await channel.send(this.i18n.help())
  }
}
