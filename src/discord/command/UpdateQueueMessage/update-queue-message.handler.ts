import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { UpdateQueueMessageCommand } from 'discord/command/UpdateQueueMessage/update-queue-message.command';
import { QueueMessageSyncRepository } from 'queue/repository/queue-message-sync.repository';
import { DiscordService } from 'discord/discord.service';

@CommandHandler(UpdateQueueMessageCommand)
export class UpdateQueueMessageHandler
  implements ICommandHandler<UpdateQueueMessageCommand> {
  private readonly logger = new Logger(UpdateQueueMessageHandler.name);

  constructor(
    private readonly qmRepository: QueueMessageSyncRepository,
    private readonly discordService: DiscordService,
  ) {}

  async execute(command: UpdateQueueMessageCommand) {
    const qm = await this.qmRepository.get(command.mode);

    if (!qm) return;

    await this.discordService.updateQueueMessage(
      qm.messageID,
      qm.channelID,
      command.mode,
      command.entries,
    );
  }
}
