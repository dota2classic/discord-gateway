import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SteamLagReportedEvent } from "../../gateway/events/steam-lag-reported.event";
import { ChannelModel, ChannelType } from "../model/channel.model";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import formatGameMode from "../../gateway/util/formatGameMode";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@EventsHandler(SteamLagReportedEvent)
export class SteamLagReportedHandler
  implements IEventHandler<SteamLagReportedEvent> {
  constructor(
    private client: Client,
    @InjectRepository(ChannelModel)
    private readonly channelModelRepository: Repository<ChannelModel>,
  ) {}

  async handle(event: SteamLagReportedEvent) {
    const channelModel = await this.channelModelRepository.findOne({
      type: ChannelType.CHAT,
    });
    if (!channelModel) return;

    const ch = (await this.client.channels.resolve(
      channelModel.channelId,
    )) as TextChannel;

    await ch.send(`Обнаружена проблема с подключением к Steam`);
  }
}
