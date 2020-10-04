import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { QueueMessageModel } from 'queue/model/queue-message.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { Client, Message, MessageOptions, TextChannel } from 'discord.js';
import { QueueMessageCreatedEvent } from 'queue/event/queue-message-created.event';
import { CreateQueueMessageCommand } from 'queue/command/CreateQueueMessage/create-queue-message.command';
import { QueueMessageSyncModel } from 'queue/model/queue-message-sync.model';

@CommandHandler(CreateQueueMessageCommand)
export class CreateQueueMessageHandler
  implements ICommandHandler<CreateQueueMessageCommand> {
  private readonly logger = new Logger(CreateQueueMessageHandler.name);

  constructor(
    @InjectRepository(QueueMessageModel)
    private readonly queueMessageModelRepository: Repository<QueueMessageModel>,
    private readonly client: Client,
    private readonly ebus: EventBus,
  ) {}

  async execute({ mode, channel }: CreateQueueMessageCommand) {
    const existing = await this.queueMessageModelRepository.findOne({ mode });
    if (existing) {
      if (existing.channelID !== channel) {
        await this.deleteMessage(existing);
        await this.queueMessageModelRepository.delete(existing);
        await this.createQueueMessage(mode, channel);
      }
    } else {
      await this.createQueueMessage(mode, channel);
    }
  }

  private async deleteMessage(qm: QueueMessageModel) {
    const ch = (await this.client.channels.fetch(qm.channelID)) as TextChannel;
    const m = await ch.messages.fetch(qm.messageID);
    if (m && m.deletable && !m.deleted) {
      await m.delete();
    }
  }

  private async createQueueMessage(mode: MatchmakingMode, channelID: string) {
    const qm = new QueueMessageModel();
    qm.mode = mode;
    qm.channelID = channelID;
    const channel = (await this.client.channels.fetch(
      channelID,
    )) as TextChannel;
    const msg = await channel.send(this.getQueueMessage(mode));
    qm.messageID = msg.id;
    await this.queueMessageModelRepository.save(qm);
    this.ebus.publish(
      new QueueMessageCreatedEvent(mode, channelID, qm.messageID),
    );
  }

  private async listenReactions(qm: QueueMessageSyncModel, msg: Message) {

  }

  private getQueueMessage(mode: MatchmakingMode): MessageOptions | string {
    return `Queue message here ${mode}`;
  }
}
