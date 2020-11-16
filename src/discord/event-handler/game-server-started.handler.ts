import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {GameServerStartedEvent} from '../../gateway/events/game-server-started.event';
import {Client} from 'discord.js';
import {DiscordUserRepository} from '../repository/discord-user.repository';
import {I18nService} from '../service/i18n.service';

@EventsHandler(GameServerStartedEvent)
export class GameServerStartedHandler
  implements IEventHandler<GameServerStartedEvent> {
  constructor(
    private client: Client,
    private readonly userRepo: DiscordUserRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(event: GameServerStartedEvent) {

    await new Promise(r => setTimeout(r, 5000));
    const allPlayers = [...event.info.radiant].concat(event.info.dire);
    allPlayers.map(async t => {
      const dp = this.userRepo.findByPlayerId(t);
      if (dp) {
        const u = await this.client.users.resolve(dp.discordId);
        u.send(this.i18n.matchReady(event.info, event.url))
      }
    });
  }
}
