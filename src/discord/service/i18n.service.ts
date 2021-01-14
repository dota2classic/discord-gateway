import { Injectable } from '@nestjs/common';
import {
  MatchmakingMode,
  RoomSizes,
} from '../../gateway/shared-types/matchmaking-mode';
import { QueueEntry } from '../event/queue-update-received.event';
import { MessageEmbed, MessageOptions } from 'discord.js';
import {
  ReadyCheckEntry,
  RoomReadyState,
} from '../../gateway/events/room-ready-check-complete.event';
import { ReadyState } from '../../gateway/events/ready-state-received.event';
import { DiscordUserRepository } from '../repository/discord-user.repository';
import { MatchInfo } from '../../gateway/events/room-ready.event';
import { PlayerId } from '../../gateway/shared-types/player-id';
import formatGameMode from '../../gateway/util/formatGameMode';
import { GameServerInfo } from '../../gateway/shared-types/game-server-info';
import heroName from './util/heroName';
import { BanStatus } from '../../gateway/queries/GetPlayerInfo/get-player-info-query.result';
import { formatDateFullStr } from './util/dates';
import * as plural from 'plural-ru';
import { profile } from './util/urls';
import { LiveMatchUpdateEvent } from '../../gateway/events/gs/live-match-update.event';

@Injectable()
export class I18nService {
  constructor(private readonly discordUserRepository: DiscordUserRepository) {}

  private formatPlayer = (it: PlayerId) => {
    const isDiscord = this.discordUserRepository.findByPlayerId(it);

    if (isDiscord) {
      return `<@${isDiscord.discordId}>`;
    }

    return profile(it);
  };

  public queueMessage(
    mode: MatchmakingMode,
    players: QueueEntry[],
  ): MessageOptions {
    if (mode === MatchmakingMode.BOTS) {
      const minutesLeft = 10 - (new Date().getMinutes() % 10);
      const formattedTimeLeft = plural.noun(
        minutesLeft,
        '%d минуту',
        '%d минуты',
        '%d минут',
      );
      const formattedPlayersLeft = plural.noun(
        2 - players.length,
        'Нужен еще %d игрок',
        'Нужно еще %d игрока',
        'Нужно еще %d игроков',
      );

      const hasEnough = 2 - players.length <= 0;

      const summary = `${
        hasEnough
          ? `Игроков достаточно, игра начнется через ${formattedTimeLeft}`
          : `Игроков недостаточно, нужно минимум 2 игрока для запуска игры`
      }`;
      return new MessageEmbed()
        .setColor('#0099ff')
        .addField('Режим', formatGameMode(mode))
        .addField(
          'Игроков для начала игры',
          `${hasEnough ? 'Игроков достаточно для игры' : formattedPlayersLeft}`,
        )
        .addField(`Проверка на игру`, `Через ${formattedTimeLeft}`)
        .addField(`Итог`, summary)
        .setDescription(
          `\n${players
            .map(
              (it, index) =>
                `     ${index + 1} **${this.formatPlayer(it.id)}**\n`,
            )
            .join('\n')}`,
        );
    }
    return new MessageEmbed()
      .setColor('#0099ff')
      .addField('Режим', formatGameMode(mode))
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
    entries: ReadyCheckEntry[],
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
      .setDescription(
        entries
          .map(entry => {
            let emojiStatus: string = ':wave:';
            const status = entry.readyState;
            if (status === ReadyState.PENDING) {
              emojiStatus = ':wave:';
            } else if (status === ReadyState.READY) {
              emojiStatus = ':white_check_mark:';
            } else if (
              status === ReadyState.DECLINE ||
              status === ReadyState.TIMEOUT
            ) {
              emojiStatus = ':no_entry_sign:';
            }

            return `${emojiStatus} \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B ${this.formatPlayer(
              entry.playerId,
            )}`;
          })
          .join('\n\n'),
      )
      .addField('Режим', formatGameMode(mode))
      .addField('Приняли игру', `${state.accepted} / ${state.total}`)
      .addField('Ваш статус', ls);
  }

  liveMatch(info: MatchInfo, matchId: number, gs: GameServerInfo) {
    const teams = this.constructTeams(info.radiant, info.dire);

    const host = gs.url.split(':')[0];
    const port = parseInt(gs.url.split(':')[1]);
    if (
      info.mode === MatchmakingMode.RANKED ||
      info.mode === MatchmakingMode.UNRANKED
    ) {
      return new MessageEmbed()
        .setColor(10638079)
        .setDescription(`${teams}`)
        .addField('Режим', formatGameMode(info.mode))
        .addField('Смотреть игру', `steam://connect/${host}:${port + 5}`);
    }

    return (
      new MessageEmbed()
        .setColor(10638079)
        .setDescription(`${teams}`)
        .addField('Режим', formatGameMode(info.mode))
        // todo fix VDS and uncomment
        // .addField('Смотреть игру', 'Просмотр недоступен для этого режима');
        .addField('Смотреть игру', `steam://connect/${host}:${port + 5}`)
    );
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

  roomNotReady() {
    return `Кто-то не принял игру.`;
  }

  noDiscordAttachment() {
    return `Этот discord аккаунт не привязан к steam аккаунту на сайте!\nЧтобы искать игру через discord и пользоваться другими функциями, привяжите аккаунт в своем профиле на сайте https://dota2classic.ru \nИскать игру на сайте можно без привязки discord аккаунта.`;
  }

  notFoundAccount() {
    return `Не могу найти этот discord аккаунт :(`;
  }

  partyInviteExpired() {
    return `Приглашение в группу истекло по времени`;
  }

  printParty(players: { leader: boolean; view: string }[], leader: PlayerId) {
    return `Ваша группа:\n${players
      .map(t => `${t.view}${t.leader ? ' (Лидер группы)' : ''}`)
      .join('\n')}`;
  }

  printStats(
    name: string,
    profileUrl: string,
    avatar: string,
    rating: number,
    rank: number,
    winrate: number,
    gamesPlayed: number,
    bestHeroes: string[],
    full: boolean,
    banStatus: BanStatus,
  ) {
    if (full) {
      const e = new MessageEmbed()
        .setImage(avatar)
        .addField(`Игрок`, name)
        .addField(`Профиль`, profileUrl)
        .addField(`Рейтинг`, `${rating} mmr, ${rank} ранг`)
        .addField(`Winrate`, `${winrate.toFixed(0)}% за ${gamesPlayed} игр`)
        .addField(
          `Лучшие герои`,
          `${bestHeroes.map(t => heroName(t)).join(', ')}`,
        );

      if (banStatus.isBanned) {
        e.addField(
          'Статус бана',
          `Активен до ${formatDateFullStr(banStatus.bannedUntil)}`,
        );
      }

      return e;
    }

    const content = `**${name}, ${rank} Ранг **\n${rating} mmr, ${winrate.toFixed(
      0,
    )}% winrate, ${gamesPlayed} сыграно.\nЛучшие герои: ${bestHeroes
      .map(t => heroName(t))
      .join(', ')} \n${profileUrl}`;

    return new MessageEmbed()
      .setDescription(content)
      .setColor(10638079)
      .setURL(profileUrl);

    // .addField(`Игрок`, name)
    // .addField(`Профиль`, profileUrl)
    // .addField(`Рейтинг`, `${rating} mmr, ${rank} ранг`)
    // .addField(`Winrate`, `${winrate.toFixed(0)}% за ${gamesPlayed} игр`)
    // .addField(
    //   `Лучшие герои`,
    //   `${bestHeroes.map(t => heroName(t)).join(', ')}`,
    // );
  }

  partyInviteResult(accept: boolean, invited: string) {
    return `${invited} ${accept ? 'принял' : 'отклонил'} предложение в группу.`;
  }

  matchmakingBanned(banStatus: BanStatus) {
    return `Вам запрещен поиск игры, но Вы можете играть онлайн с ботами. Время окончания бана: ${formatDateFullStr(
      banStatus.bannedUntil,
    )}. `;
  }

  help() {
    return `Список команд:\n
\`!stats\` - выводит Вашу статистику или @отмеченного игрока
\`!profile\` - выводит Вашу статистику или @отмеченного игрока в полной форме
\`!invite @игрок\` - приглашает игрока в группу
\`!party\` - выводит список игроков в Вашей группе
\`!unparty\` - покинуть группу
\`!live\` - выводит preview текущей игры
\`!site\` - страницы сайта`;
  }

  liveMatchPreviewInGame(
    b: Buffer,
    liveMatch: LiveMatchUpdateEvent,
  ): MessageOptions {
    const r = liveMatch.heroes
      .filter(t => t.team === 2)
      .reduce((a, b) => a + b.kills, 0);
    const d = liveMatch.heroes
      .filter(t => t.team === 3)
      .reduce((a, b) => a + b.kills, 0);

    return {
      content: `${formatGameMode(
        liveMatch.type,
      )}, ${r} - ${d}\nСмотреть игру на сайте: https://dota2classic.ru/match/${
        liveMatch.matchId
      }`,
      // files: [b],
    };
  }

  welcomeMessage() {
    return new MessageEmbed()
      .setDescription(`Как начать играть в Dota 2 Classic 6.81b?

1. Скачайте клиент Dota 2 Classic 6.81b на сайте https://dota2classic.ru/download
2. Авторизуйтесь на нашем сайте через Steam https://dota2classic.ru/
3. На странице поиска игры https://dota2classic.ru/queue выберите режим и нажмите Искать игру. Если закрыть вкладку, поиск прекратится через минуту.
4. **Запустите Steam и войдите в свой аккаунт (в тот, через который авторизовались на нашем сайте).**
5. Когда игра будет найдена, на сайте появится и прозвучит уведомление для принятия игры.
6. Запустите старый клиент через файл dota.exe, находящийся в папке Dota 2 Classic 6.81b.
7. Когда все 10 человек на сайте примут игру, по кнопке Подключиться к игре можно будет присоединиться к игре.

**ВНИМАНИЕ!
НЕ НУЖНО НАЖИМАТЬ КНОПКУ "НАЙТИ ИГРУ" В СТАРОМ КЛИЕНТЕ.
ВЫ ПОЛУЧИТЕ ВРЕМЕННЫЙ БАН ПОИСКА В АКТУАЛЬНОЙ ВЕРСИИ DOTA 2.**`);
  }

  rankedLocked(newbieGamesLeft: number) {
    return `Чтобы играть рейтинговые игры, нужно сыграть еще ${newbieGamesLeft} игр в обычном режиме или режиме с ботами. `;
  }
}
