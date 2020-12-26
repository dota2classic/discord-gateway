import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserUpdatedEvent } from '../../gateway/events/user/user-updated.event';
import { AppService } from '../../app.service';
import { UserRoleTimingsUpdateEvent } from "../../gateway/events/user/user-role-timings-update.event";

@EventsHandler(UserRoleTimingsUpdateEvent)
export class UserUpdatedHandler implements IEventHandler<UserRoleTimingsUpdateEvent> {
  constructor(private readonly appService: AppService) {}

  async handle(event: UserRoleTimingsUpdateEvent) {
    await this.appService.syncRoles();
  }
}
