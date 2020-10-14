import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import {Logger} from '@nestjs/common';
import {DeliverReadyCheckCommand} from './deliver-ready-check.command';
import {Client, Collection, Message, MessageReaction, Snowflake, User,} from 'discord.js';
import {ReadyCheckRepository} from '../../repository/ready-check.repository';
import {ReadyCheckModel} from '../../model/ready-check.model';
import {EmojiService} from '../../service/emoji.service';
import {ROOM_READY_CHECK_ACCEPT_TIME} from '../../../gateway/constants/times';
import {I18nService} from '../../service/i18n.service';
import {ReadyState, ReadyStateReceivedEvent} from '../../../gateway/events/ready-state-received.event';
import {DiscordUserRepository} from "../../repository/discord-user.repository";

@CommandHandler(DeliverReadyCheckCommand)
export class DeliverReadyCheckHandler
  implements ICommandHandler<DeliverReadyCheckCommand> {
  private readonly logger = new Logger(DeliverReadyCheckHandler.name);

  constructor(
    private readonly client: Client,
    private readonly readyCheckRepository: ReadyCheckRepository,
    private readonly emojiService: EmojiService,
    private readonly i18nService: I18nService,
    private readonly ebus: EventBus,
    private readonly discordUserRepository: DiscordUserRepository
  ) {}

  async execute(command: DeliverReadyCheckCommand) {
    const user = await this.client.users.resolve(command.discordID);
    const msg = await user.send(
      this.i18nService.readyCheck(
        command.mode,
        command.state,
        ReadyState.PENDING,
      ),
    );
    const rc = new ReadyCheckModel(
      user.id,
      msg.id,
      msg.channel.id,
      command.roomID,
      command.mode,
      command.state,
    );
    rc.globalState = command.state;
    await this.readyCheckRepository.save(rc.id, rc);

    await this.listenReactions(msg, user, rc);

    await Promise.all([
      msg.react(this.emojiService.getAcceptEmoji()),
      msg.react(this.emojiService.getDeclineEmoji()),
    ]);
  }

  private options() {
    return [
      this.emojiService.getAcceptEmoji(),
      this.emojiService.getDeclineEmoji(),
    ];
  }
  private filter = (reaction: MessageReaction, user: User) => {
    return (
      // one of options
      this.options().includes(reaction.emoji.name) &&
      // and not bot
      user.id !== reaction.message.author.id
    );
  };

  private process = async (
    msg: Message,
    user: User,
    collected: Collection<Snowflake, MessageReaction>,
  ): Promise<string | undefined> => {
    return this.options().find(it => {
      const some = collected
        .get(it)
        ?.users.cache.filter(u => u.id !== msg.author.id);
      return !!(some && some.size > 0);
    });
  };

  private async listenReactions(msg: Message, user: User, rc: ReadyCheckModel) {
    const reactor = msg
      .awaitReactions(this.filter, {
        max: 1, // we need 1 reaction only
        time: ROOM_READY_CHECK_ACCEPT_TIME,
        errors: ['time'],
      })
      .then(c => this.process(msg, user, c))
      .catch(c => this.process(msg, user, c));

    const updateReadyState = (rs: ReadyState) => {
      msg.edit(
        this.i18nService.readyCheck(rc.mode, rc.globalState, rc.readyState),
      );
    };

    reactor.then(t => {
      if (t === this.emojiService.getAcceptEmoji()) {
        rc.readyState = ReadyState.READY;
      } else if (t === this.emojiService.getDeclineEmoji()) {
        rc.readyState = ReadyState.DECLINE;
      } else {
        rc.readyState = ReadyState.TIMEOUT;
      }
      this.ebus.publish(
        new ReadyStateReceivedEvent(this.discordUserRepository.get(rc.userId).playerId, rc.roomId, rc.readyState),
      );
      updateReadyState(rc.readyState);
    });
  }
}
