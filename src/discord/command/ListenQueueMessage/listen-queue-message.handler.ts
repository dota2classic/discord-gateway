import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ListenQueueMessageCommand } from 'discord/command/ListenQueueMessage/listen-queue-message.command';
import { Client } from 'discord.js';
import { DiscordService } from 'discord/service/discord.service';

@CommandHandler(ListenQueueMessageCommand)
export class ListenQueueMessageHandler
  implements ICommandHandler<ListenQueueMessageCommand> {
  private readonly logger = new Logger(ListenQueueMessageHandler.name);

  constructor(
    private readonly client: Client,
    private readonly ebus: EventBus,
    private readonly cbus: CommandBus,
    private readonly discordService: DiscordService,
  ) {}

  async execute(command: ListenQueueMessageCommand) {
    await this.discordService.listenReactions(
      command.messageID,
      command.channelID,
      command.mode,
    );
  }
}