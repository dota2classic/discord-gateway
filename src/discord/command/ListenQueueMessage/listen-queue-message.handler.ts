import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ListenQueueMessageCommand } from 'discord/command/ListenQueueMessage/listen-queue-message.command';
import { EmojiService } from 'discord/emoji.service';
import { Client, MessageReaction, TextChannel, User } from 'discord.js';

@CommandHandler(ListenQueueMessageCommand)
export class ListenQueueMessageHandler
  implements ICommandHandler<ListenQueueMessageCommand> {
  private readonly logger = new Logger(ListenQueueMessageHandler.name);

  constructor(
    private readonly client: Client,
    private readonly ebus: EventBus,
    private readonly emojiService: EmojiService,
  ) {}

  async execute(command: ListenQueueMessageCommand) {
    const ch = (await this.client.channels.fetch(
      command.channelID,
    )) as TextChannel;
    const msg = await ch.messages.fetch(command.messageID);
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
    // await preset reactions

    collector.addListener('collect', async (reaction, user: User) => {
      if (reaction.emoji.id === qEmoji.id) {
        // this.ebus.publish(new DiscordEnterQueueEvent(qp, command.mode));
      } else if (reaction.emoji.id === deqEmoji.id) {
        // const party = await this.partyRepository.getPartyOf(qp);
        // this.ebus.publish(new DiscordLeaveQueueEvent(party.id, command.mode));
      }
      await msg?.reactions.resolve(reaction.emoji.id)?.users.remove(user.id);
    });

    this.logger.log(`Listening to reactions for mode [${command.mode}]`);
  }
}
