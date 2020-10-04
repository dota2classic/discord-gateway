import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { UpdateQueueMessageCommand } from 'discord/command/UpdateQueueMessage/update-queue-message.command';
import { Client, TextChannel } from 'discord.js';
import { EmojiService } from 'discord/emoji.service';
import { QueueMessageSyncRepository } from 'queue/repository/queue-message-sync.repository';
import { messages } from 'util/i18n';

@CommandHandler(UpdateQueueMessageCommand)
export class UpdateQueueMessageHandler
  implements ICommandHandler<UpdateQueueMessageCommand> {
  private readonly logger = new Logger(UpdateQueueMessageHandler.name);

  constructor(
    private readonly client: Client,
    private readonly ebus: EventBus,
    private readonly emojiService: EmojiService,
    private readonly cbus: CommandBus,
    private readonly qmRepository: QueueMessageSyncRepository,
  ) {}

  async execute(command: UpdateQueueMessageCommand) {
    const qm = await this.qmRepository.get(command.mode);

    if (!qm) return;

    const ch = (await this.client.channels.fetch(qm.channelID)) as TextChannel;
    const msg = await ch.messages.fetch(qm.messageID);

    await msg.edit(messages.queueMessage(command.mode, command.entries));
  }
}
