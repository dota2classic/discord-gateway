import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserUpdatedEvent } from '../../gateway/events/user/user-updated.event';
import { AppService } from '../../app.service';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(private readonly appService: AppService) {}

  async handle(event: UserUpdatedEvent) {
    await this.appService.syncRoles();
  }
}
