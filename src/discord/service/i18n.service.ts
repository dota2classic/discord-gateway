import { Injectable } from '@nestjs/common';
import {
  MatchmakingMode,
  RoomSizes,
} from '../../gateway/shared-types/matchmaking-mode';
import { QueueEntry } from '../event/queue-update-received.event';
import { Client, MessageEmbed, MessageOptions } from 'discord.js';
import { RoomReadyState } from '../../gateway/events/room-ready-check-complete.event';
import { ReadyState } from '../../gateway/events/ready-state-received.event';
import { DiscordUserRepository } from '../repository/discord-user.repository';
import { MatchInfo } from '../../gateway/events/room-ready.event';
import { PlayerId } from '../../gateway/shared-types/player-id';
import formatGameMode from '../../gateway/util/formatGameMode';
import { GameServerInfo } from '../../gateway/shared-types/game-server-info';

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

  private formatPlayer = (it: PlayerId) => {
    const isDiscord = this.discordUserRepository.findByPlayerId(it);

    if (isDiscord) {
      return `<@${isDiscord.discordId}>`;
    }

    return it.value;
  };
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
              `     ${index + 1} **${this.formatPlayer(it.id)}**\n`,
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

  liveMatch(info: MatchInfo, matchId: number, gs: GameServerInfo) {
    const teams = this.constructTeams(info.radiant, info.dire);

    return new MessageEmbed()
      .setColor(10638079)
      .setDescription(`${teams}`)
      .addField('Режим', formatGameMode(info.mode))
      .addField('Смотреть игру', `steam://connect/${gs.watchURL}`);
    // .addField('Голосов для рехоста', `${votes} из ${votesToRehost}`);
  }

  private constructTeams(radiant: PlayerId[], dire: PlayerId[]) {
    if (radiant === undefined || dire === undefined) {
      return ``;
    }

    return (
      `**Свет**:\n${radiant.map(it => this.formatPlayer(it)).join('\n')}\n` +
      `**Тьма**:\n${dire.map(it => this.formatPlayer(it)).join('\n')}`
    );
  }

  matchReady(info: MatchInfo, url: string) {
    return new MessageEmbed()
      .setDescription(
        `Игра готова! \nКоманды: \n${this.constructTeams(
          info.radiant,
          info.dire,
        )}`,
      )
      .setFooter('Перед тем как нажать на ссылку, откройте старый клиент')
      .addField('Режим', formatGameMode(info.mode))
      .addField('Играть', `steam://connect/${url}`);
  }
}
