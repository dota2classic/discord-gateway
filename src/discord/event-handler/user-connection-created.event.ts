import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {UserConnectionCreatedEvent} from "../../gateway/events/user/user-connection-created.event";
import {DiscordUserRepository} from "../repository/discord-user.repository";
import {UserConnection} from "../../gateway/shared-types/user-connection";
import {DiscordUserModel} from "../model/discord-user.model";

@EventsHandler(UserConnectionCreatedEvent)
export class UserConnectionCreatedHandler
  implements IEventHandler<UserConnectionCreatedEvent> {
  constructor(private readonly discordUserRepository: DiscordUserRepository) {}

  async handle(event: UserConnectionCreatedEvent) {
    if (event.connection !== UserConnection.DISCORD) return;
    this.discordUserRepository.save(
      event.externalId,
      new DiscordUserModel(event.externalId, event.playerId),
    );
  }
}
