import { Injectable } from '@nestjs/common';
import { MatchmakingMode } from '../../gateway/shared-types/matchmaking-mode';
import { QueueEntry } from '../event/queue-update-received.event';
import { Client, MessageEmbed, MessageOptions } from 'discord.js';
import { RoomReadyState } from '../../gateway/events/room-ready-check-complete.event';
import { ReadyState } from '../../gateway/events/ready-state-received.event';
import { DiscordUserRepository } from '../repository/discord-user.repository';

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

@Injectable()
export class I18nService {
  constructor(
    private readonly client: Client,
    private readonly discordUserRepository: DiscordUserRepository,
  ) {}
  public queueMessage(
    mode: MatchmakingMode,
    players: QueueEntry[],
  ): MessageOptions {
    return new MessageEmbed()
      .setColor('#0099ff')
      .addField('Режим', Names[mode])
      .addField('Игроков для игры', `${players.length} / ${RoomSizes[mode]}`)
      .setDescription(
        `${players
          .map(
            (it, index) =>
              `     ${index + 1} **${it.isDiscord ? `<@${this.discordUserRepository.findByPlayerId(it.id)?.discordId}>` : it.id}**\n`,
          )
          .join('\n')}`,
      );
  }

  public readyCheck(
    mode: MatchmakingMode,
    state: RoomReadyState,
    localState: ReadyState,
  ): MessageOptions {
    let ls = '';
    if (localState === ReadyState.PENDING) {
      ls = 'Примите игру!';
    } else if (localState === ReadyState.TIMEOUT) {
      ls = 'Вы не приняли игру';
    } else if (localState === ReadyState.READY) {
      ls = 'Вы приняли игру';
    } else if (localState === ReadyState.DECLINE) {
      ls = 'Вы отклонили игру';
    }
    return new MessageEmbed()
      .setColor('#0099ff')
      .addField('Режим', Names[mode])
      .addField('Приняли игру', `${state.accepted} / ${state.total}`)
      .addField('Ваш статус', ls);
  }
}
