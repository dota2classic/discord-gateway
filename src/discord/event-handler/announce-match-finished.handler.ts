import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MatchFinishedEvent } from '../../gateway/events/match-finished.event';
import {Client, MessageEmbed, TextChannel} from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import {ChannelModel, ChannelType} from '../model/channel.model';
import { Repository } from 'typeorm';
import formatGameMode from "../../gateway/util/formatGameMode";

@EventsHandler(MatchFinishedEvent)
export class AnnounceMatchFinishedHandler
  implements IEventHandler<MatchFinishedEvent> {
  constructor(
    private client: Client,
    @InjectRepository(ChannelModel)
    private readonly channelModelRepository: Repository<ChannelModel>,
  ) {}

  async handle(event: MatchFinishedEvent) {

    const channelModel = await this.channelModelRepository.findOne({
      type: ChannelType.CHAT,
    });
    if (!channelModel) return;


    const ch = (await this.client.channels.resolve(
      channelModel.channelId,
    )) as TextChannel;

    const embed = new MessageEmbed()
      .setDescription("Матч завершен!")
      .addField("Режим", formatGameMode(event.info.mode))
      .addField("Ссылка на матч", `https://dota2classic.ru/match/${event.matchId}`)
    await ch.send(embed)
  }
}
