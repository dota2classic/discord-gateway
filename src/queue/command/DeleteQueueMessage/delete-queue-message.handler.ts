import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DeleteQueueMessageCommand } from 'queue/command/DeleteQueueMessage/delete-queue-message.command';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueMessageModel } from 'queue/model/queue-message.model';
import { Repository } from 'typeorm';
import { Client } from 'discord.js';

@CommandHandler(DeleteQueueMessageCommand)
export class DeleteQueueMessageHandler
  implements ICommandHandler<DeleteQueueMessageCommand> {
  private readonly logger = new Logger(DeleteQueueMessageHandler.name);

  constructor(
    @InjectRepository(QueueMessageModel)
    private readonly queueMessageModelRepository: Repository<QueueMessageModel>,
    private readonly client: Client,
    private readonly ebus: EventBus,
  ) {}

  async execute({ mode }: DeleteQueueMessageCommand) {
    const existing = await this.queueMessageModelRepository.findOne({ mode });
    if (existing) {
      await this.queueMessageModelRepository.delete(existing);
    }
  }
}
