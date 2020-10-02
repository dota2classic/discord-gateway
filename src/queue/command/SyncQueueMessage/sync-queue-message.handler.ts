import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SyncQueueMessageCommand } from 'src/queue/command/SyncQueueMessage/sync-queue-message.command';
import { Client } from 'discord.js';
import { QueueMessageSyncRepository } from 'src/queue/repository/queue-message-sync.repository';

@CommandHandler(SyncQueueMessageCommand)
export class SyncQueueMessageHandler
  implements ICommandHandler<SyncQueueMessageCommand> {
  private readonly logger = new Logger(SyncQueueMessageHandler.name);

  constructor(
    private readonly client: Client,
    private readonly queueMessageSyncRep: QueueMessageSyncRepository,
  ) {}

  async execute(command: SyncQueueMessageCommand) {
    const existingSync = await this.queueMessageSyncRep.get(command.mode);
    // if it exists in runtime, we assume we already listen to stuff.
    if (existingSync) return;
  }
}
