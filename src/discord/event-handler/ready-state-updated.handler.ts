import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {ReadyStateUpdatedEvent} from "../../gateway/events/ready-state-updated.event";
import {Client} from "discord.js";
import {ReadyCheckRepository} from "../repository/ready-check.repository";
import {EmojiService} from "../service/emoji.service";
import {I18nService} from "../service/i18n.service";
import {DiscordService} from "../service/discord.service";
import {inspect} from "util";

@EventsHandler(ReadyStateUpdatedEvent)
export class ReadyStateUpdatedHandler
  implements IEventHandler<ReadyStateUpdatedEvent> {
  constructor(
    private client: Client,
    private readonly readyCheckRepository: ReadyCheckRepository,
    private readonly emojiService: EmojiService,
    private readonly discordService: DiscordService,
    private readonly i18nService: I18nService,
  ) {}

  async handle(event: ReadyStateUpdatedEvent) {
    const checks = (await this.readyCheckRepository.all()).filter(
      t => t.roomId === event.roomID,
    );
    await Promise.all(
      checks.map(async t => {
        const msg = await this.discordService.getMessage(
          t.messageId,
          t.channelId,
        );
        await msg.edit(
          this.i18nService.readyCheck(event.mode, event.state, event.entries, t.readyState),
        );
      }),
    );
  }
}
