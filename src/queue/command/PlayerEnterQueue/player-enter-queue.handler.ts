import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PlayerEnterQueueCommand } from 'gateway/commands/player-enter-queue.command';

@CommandHandler(PlayerEnterQueueCommand)
export class PlayerEnterQueueHandler
  implements ICommandHandler<PlayerEnterQueueCommand> {
  private readonly logger = new Logger(PlayerEnterQueueHandler.name);

  constructor(@Inject('QueryCore') private redis: ClientProxy) {}

  async execute(command: PlayerEnterQueueCommand) {
    return this.redis.emit(PlayerEnterQueueCommand.name, command).toPromise();
  }
}
