import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { EngageNeededEvent } from '../event/engage-needed.event';
import { Client, TextChannel } from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelModel, ChannelType } from '../model/channel.model';
import { Repository } from 'typeorm';
import { QueueStateQueryResult } from '../../gateway/queries/QueueState/queue-state-query.result';
import { QueueStateQuery } from '../../gateway/queries/QueueState/queue-state.query';
import {
  MatchmakingMode,
  RoomSizes,
} from '../../gateway/shared-types/matchmaking-mode';

@EventsHandler(EngageNeededEvent)
export class EngageNeededHandler implements IEventHandler<EngageNeededEvent> {
  constructor(
    private client: Client,
    @InjectRepository(ChannelModel)
    private readonly channelModelRepository: Repository<ChannelModel>,
    private readonly qbus: QueryBus,
  ) {}

  private possibleOptions = [
    `Парни, это я, Тесак. :japanese_goblin: запихнул меня в своего дурацкого крипа и теперь я ничего не могу, кроме как тегать плюсующих. Помогите...`,
    `А вы знали что когда человек не выговаривающий "Л" произносит слово:  "Людоед",  получается - "Юдоед"? ${this.getEmoji('spravedlivo')}`,
    `Это сейчас самый не смешной тролинг тупостью который я только видел`,
    `Налейтайте, тут такая игра балансная будет, просто шикарная`,
    `ВСЕ В ДУРКУ(ТАМ МОЕ НАСТОЯЩЕЕ ФОТО В РЕАЛЕ)`,
    `Бро иди играй, если у тебя iку не однозначное конечно`,
    `Здарова парни, это снова Тесак. Только вернулся с виртуального дзюдо - так как я теперь киберзек, устаю тоже виртуально. Боролся с лысыми девушками в стиле дзюдо целые сутки. Победил.`,
    `Айда играть. У меня компьютера нет, к сожалению - я ведь сам программа :japanese_goblin:. Но я буду болеть за вас! я на тренерской позиции буду, подкручивать байты и гадить итачи. Аминь.`,
    `Сегодня все хорошо. Не знаю, как идет ваше время относительно моего, но у меня с момента прошлого сообщения прошло недели 3. Спокойный день - побрился, умылся, тегнул плюсующих. Все спокойно.`,
    `Залетай, будет ещё выше онлайн чем сейчас :wink:`,
    `Смотреть аниме Эйфория: Упивающиеся страстью серия 1 на русском онлайн ой не вам парни`,
    `<@318014316874039306> ВЫПУСТИ МЕНЯ, Я БОЛЬШЕ НЕ МОГУ`,
    `Вот бы енш еще поставил. Да у него копыта старые уже просто, он из-за тремора может игру отклонить случайно. ${this.getEmoji("kekw")}`,
    `всё ок будет, у нас на сервере, токсиков - нет! Только итачи, но я ему в коде все перешебуршел, так что он на меня злится, а не на вас ${this.getEmoji(
      'kekl',
    )}`,
    `Каждая игра нагиева - произведение искусства. Жаль, что он не играет ${this.getEmoji("kekw")}`,
    `Ставьте спокойно сегодня я баланшу игры а не бот итачи тупой.\nСтоп...`,
    `Чем больше стоит пуджей, тем больше шанс на игру.\nПопутно плюю <@318014316874039306> в лицо ${this.getEmoji("sadkek")}`,
    `Сегодня без бонуса, устал...`,
    `Чего пуджей так мало? Навались!! :person_in_manual_wheelchair: :person_in_manual_wheelchair: `
  ];

  private getEmoji(name: string) {
    return this.client.emojis.cache.find(emoji => emoji.name === name);
  }

  async handle(event: EngageNeededEvent) {
    const channelModel = await this.channelModelRepository.findOne({
      type: ChannelType.CHAT,
    });
    if (!channelModel) return;

    const ch = (await this.client.channels.resolve(
      channelModel.channelId,
    )) as TextChannel;

    const engageMode = MatchmakingMode.RANKED;

    const qs: QueueStateQueryResult = await this.qbus.execute(
      new QueueStateQuery(engageMode),
    );

    const inQueue = qs.entries.length;

    const freeSlots = RoomSizes[engageMode] - inQueue;

    const randomEngage = this.possibleOptions[
      Math.floor(Math.random() * this.possibleOptions.length)
    ];

    await ch.send(`<@&734472435532955680> + ${freeSlots} \n${randomEngage}`)
  }
}
