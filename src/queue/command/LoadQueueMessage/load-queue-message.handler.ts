import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { LoadQueueMessageCommand } from 'queue/command/LoadQueueMessage/load-queue-message.command';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueMessageModel } from 'queue/model/queue-message.model';
import { Repository } from 'typeorm';
import { QueueMessageLoadedEvent } from 'queue/event/queue-message-loaded.event';

@CommandHandler(LoadQueueMessageCommand)
export class LoadQueueMessageHandler
  implements ICommandHandler<LoadQueueMessageCommand> {
  private readonly logger = new Logger(LoadQueueMessageHandler.name);

  constructor(
    @InjectRepository(QueueMessageModel)
    private readonly queueMessageModelRepository: Repository<QueueMessageModel>,
    private readonly ebus: EventBus,
  ) {}

  async execute(command: LoadQueueMessageCommand) {
    const qm = await this.queueMessageModelRepository.findOne({
      mode: command.mode,
    });

    if (qm) {
      this.ebus.publish(
        new QueueMessageLoadedEvent(qm.mode, qm.channelID, qm.messageID),
      );
    }
  }
}
