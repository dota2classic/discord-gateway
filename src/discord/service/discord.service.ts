import { Injectable, Logger } from '@nestjs/common';
import {
  Client,
  Collection,
  Message,
  MessageReaction,
  Snowflake,
  TextChannel,
  User,
} from 'discord.js';
import { QueueEntry } from 'discord/event/queue-update-received.event';
import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { EmojiService } from 'discord/service/emoji.service';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { I18nService } from './i18n.service';
import { DiscordEnterQueueEvent } from '../event/discord-enter-queue.event';
import { DiscordLeaveQueueEvent } from '../event/discord-leave-queue.event';
import { PartyInviteCreatedEvent } from '../../gateway/events/party/party-invite-created.event';
import { DiscordUserModel } from '../model/discord-user.model';
import { GetUserInfoQueryResult } from '../../gateway/queries/GetUserInfo/get-user-info-query.result';
import {
  ACCEPT_GAME_TIMEOUT,
  PARTY_INVITE_LIFETIME,
} from '../../gateway/shared-types/timings';
import {
  ReadyState,
  ReadyStateReceivedEvent,
} from '../../gateway/events/ready-state-received.event';
import { PartyInviteAcceptedEvent } from "../../gateway/events/party/party-invite-accepted.event";

@Injectable()
export class DiscordService {
  constructor(
    private readonly client: Client,
    private readonly emojiService: EmojiService,
    private readonly cbus: CommandBus,
    private readonly i18nService: I18nService,
    private readonly ebus: EventBus,
  ) {}

  private readonly logger = new Logger(DiscordService.name);

  public async getMessage(id: Snowflake, channelID: Snowflake) {
    const ch = (await this.client.channels.fetch(channelID)) as TextChannel;
    return ch.messages.fetch(id);
  }

  public async updateQueueMessage(
    id: Snowflake,
    channelId: Snowflake,
    mode: MatchmakingMode,
    entries: QueueEntry[],
  ) {
    const msg = await this.getMessage(id, channelId);

    await msg.edit(this.i18nService.queueMessage(mode, entries));
  }

  public async listenReactions(
    messageID: Snowflake,
    channelID: Snowflake,
    mode: MatchmakingMode,
  ) {
    const msg = await this.getMessage(messageID, channelID);
    const qEmoji = await this.emojiService.getQueueEmoji();
    const deqEmoji = await this.emojiService.getDequeueEmoji();
    await msg.react(qEmoji);
    await msg.react(deqEmoji);

    const filter = (reaction: MessageReaction, user: User) => {
      return (
        // equal to play moji
        (qEmoji.id === reaction.emoji.id ||
          deqEmoji.id === reaction.emoji.id) &&
        user.id !== reaction.message.author.id
      );
    };

    const collector = msg.createReactionCollector(filter, {
      dispose: true,
    });

    collector.on('collect', async (reaction, user: User) => {
      console.log(reaction.emoji.id, qEmoji.id);
      if (reaction.emoji.id === qEmoji.id) {
        // this.ebus.publish(new DiscordEnterQueueEvent(qp, command.mode));
        // for now
        this.ebus.publish(new DiscordEnterQueueEvent(user.id, mode));
      } else if (reaction.emoji.id === deqEmoji.id) {
        this.ebus.publish(new DiscordLeaveQueueEvent(user.id, mode));
      }
      await msg?.reactions.resolve(reaction.emoji.id)?.users.remove(user.id);
    });

    this.logger.log(`Listening to reactions for mode [${mode}]`);
  }

  async partyInvite(
    user: User,
    inviter: DiscordUserModel | undefined,
    res: GetUserInfoQueryResult,
    event: PartyInviteCreatedEvent,
  ) {
    const msg = !!inviter
      ? await user.send(`<@${inviter.discordId}> приглашает Вас в группу`)
      : await user.send(`${res.name} приглашает Вас в группу`);

    const qEmoji = await this.emojiService.getAcceptEmoji();
    const deqEmoji = await this.emojiService.getDeclineEmoji();
    await msg.react(qEmoji);
    await msg.react(deqEmoji);

    const options = [
      this.emojiService.getAcceptEmoji(),
      this.emojiService.getDeclineEmoji(),
    ];

    const filter = (reaction: MessageReaction, user: User) => {
      return (
        // one of options
        options.includes(reaction.emoji.name) &&
        // and not bot
        user.id !== reaction.message.author.id
      );
    };

    const process = async (
      msg: Message,
      user: User,
      collected: Collection<Snowflake, MessageReaction>,
    ): Promise<string | undefined> => {
      return options.find(it => {
        const some = collected
          .get(it)
          ?.users.cache.filter(u => u.id !== msg.author.id);
        return !!(some && some.size > 0);
      });
    };

    const reactor = msg
      .awaitReactions(filter, {
        max: 1, // we need 1 reaction only
        time: PARTY_INVITE_LIFETIME,
        errors: ['time'],
      })
      .then(c => process(msg, user, c))
      .catch(c => process(msg, user, c));

    reactor.then(t => {
      if (t === this.emojiService.getAcceptEmoji()) {
        // emit
        this.ebus.publish(new PartyInviteAcceptedEvent(event.id, event.invited, true))
      } else {
        // timeout or explicit decline
        this.ebus.publish(new PartyInviteAcceptedEvent(event.id, event.invited, false))
        return;
      }
    });

    this.logger.log(`Awaiting party invite result`);
  }
}
