import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SyncRolesCommand } from './sync-roles.command';
import { AppService } from '../../../app.service';

@CommandHandler(SyncRolesCommand)
export class SyncRolesHandler implements ICommandHandler<SyncRolesCommand> {
  private readonly logger = new Logger(SyncRolesHandler.name);

  constructor(private readonly appService: AppService) {}

  async execute(command: SyncRolesCommand) {
    await this.appService.syncRoles();
  }
}
