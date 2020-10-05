import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PlayerLeaveQueueCommand } from 'gateway/commands/player-leave-queue.command';

@CommandHandler(PlayerLeaveQueueCommand)
export class PlayerLeaveQueueHandler
  implements ICommandHandler<PlayerLeaveQueueCommand> {
  private readonly logger = new Logger(PlayerLeaveQueueHandler.name);

  constructor(@Inject('QueryCore') private redis: ClientProxy) {
  }

  async execute(command: PlayerLeaveQueueCommand) {
    return this.redis.emit(PlayerLeaveQueueCommand.name, command).toPromise();
  }
}