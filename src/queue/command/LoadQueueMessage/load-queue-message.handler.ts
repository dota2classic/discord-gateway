import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { LoadQueueMessageCommand } from 'queue/command/LoadQueueMessage/load-queue-message.command';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueMessageModel } from 'queue/model/queue-message.model';
import { Repository } from 'typeorm';
import { QueueMessageLoadedEvent } from 'queue/event/queue-message-loaded.event';
import { QueueMessageSyncRepository } from 'queue/repository/queue-message-sync.repository';
import { QueueMessageSyncModel } from 'queue/model/queue-message-sync.model';

@CommandHandler(LoadQueueMessageCommand)
export class LoadQueueMessageHandler
  implements ICommandHandler<LoadQueueMessageCommand> {
  private readonly logger = new Logger(LoadQueueMessageHandler.name);

  constructor(
    @InjectRepository(QueueMessageModel)
    private readonly queueMessageModelRepository: Repository<QueueMessageModel>,
    private readonly qmRep: QueueMessageSyncRepository,
    private readonly ebus: EventBus,
  ) {}

  async execute(command: LoadQueueMessageCommand) {
    const qm = await this.queueMessageModelRepository.findOne({
      mode: command.mode,
    });
    if (qm) {
      const q = new QueueMessageSyncModel(qm.mode, qm.messageID, qm.channelID);
      await this.qmRep.save(q.mode, q);
      this.ebus.publish(
        new QueueMessageLoadedEvent(qm.mode, qm.channelID, qm.messageID),
      );
    }
  }
}
