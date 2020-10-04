import { MatchmakingMode } from 'gateway/shared-types/matchmaking-mode';
import { MessageEmbed, MessageOptions } from 'discord.js';
import { QueueEntry } from 'discord/event/queue-update-received.event';

export const messages = {
  queueMessage(mode: MatchmakingMode, players: QueueEntry[]): MessageOptions {
    return new MessageEmbed()
      .setColor('#0099ff')
      .addField('Режим', Names[mode])
      .addField('Игроков для игры', `${players.length} / ${RoomSizes[mode]}`)
      .setDescription(
        `${players
          .map(
            (it, index) =>
              `     ${index + 1} **${it.isDiscord ? `<@${it.id}>` : it.id}**\n`,
          )
          .join('\n')}`,
      );
  },
};

export const RoomSizes: { [key in MatchmakingMode]: number } = {
  [MatchmakingMode.SOLOMID]: 2,
  [MatchmakingMode.RANKED]: 10,
  [MatchmakingMode.UNRANKED]: 10,
};

export const Names = {
  [MatchmakingMode.RANKED]: 'РЕЙТИНГ',
  [MatchmakingMode.UNRANKED]: 'ОБЫЧНАЯ',
  [MatchmakingMode.SOLOMID]: '1x1 МИД',
  // [MatchmakingMode.DIRETIDE]: 'DIRETIDE',
  // [MatchmakingMode.GREEVILING]: 'GREEVILING',
  // [MatchmakingMode.ABILITY_DRAFT]: 'ABILITY DRAFT',
};
