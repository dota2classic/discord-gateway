import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelModel, ChannelType } from "../model/channel.model";
import { Repository } from "typeorm";
import formatGameMode from "../../gateway/util/formatGameMode";
import { GameResultsEvent } from "../../gateway/events/gs/game-results.event";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";

@EventsHandler(GameResultsEvent)
export class AnnounceMatchFinishedHandler
  implements IEventHandler<GameResultsEvent> {
  constructor(
    private client: Client,
    @InjectRepository(ChannelModel)
    private readonly channelModelRepository: Repository<ChannelModel>,
  ) {}

  async handle(event: GameResultsEvent) {


    if(event.type === MatchmakingMode.SOLOMID) return;
    const channelModel = await this.channelModelRepository.findOne({
      type: ChannelType.CHAT,
    });
    if (!channelModel) return;


    const ch = (await this.client.channels.resolve(
      channelModel.channelId,
    )) as TextChannel;

    const embed = new MessageEmbed()
      .setDescription("Матч завершен!")
      .addField("Режим", formatGameMode(event.type))
      .addField("Ссылка на матч", `https://dota2classic.ru/match/${event.matchId}`)
    await ch.send(embed)
  }
}
