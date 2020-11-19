import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { PrintStatsCommand } from "./print-stats.command";
import { Client, TextChannel } from "discord.js";
import { I18nService } from "../../service/i18n.service";
import { DiscordUserRepository } from "../../repository/discord-user.repository";
import { GetPlayerInfoQuery } from "../../../gateway/queries/GetPlayerInfo/get-player-info.query";
import { Dota2Version } from "../../../gateway/shared-types/dota2version";
import { GetPlayerInfoQueryResult } from "../../../gateway/queries/GetPlayerInfo/get-player-info-query.result";
import { GetUserQueueQuery } from "../../../gateway/queries/GetUserQueue/get-user-queue.query";
import { GetUserQueueQueryResult } from "../../../gateway/queries/GetUserQueue/get-user-queue-query.result";
import { GetUserInfoQuery } from "../../../gateway/queries/GetUserInfo/get-user-info.query";
import { GetUserInfoQueryResult } from "../../../gateway/queries/GetUserInfo/get-user-info-query.result";
import { steamIdToNum } from "../../service/util/steamids";

@CommandHandler(PrintStatsCommand)
export class PrintStatsHandler implements ICommandHandler<PrintStatsCommand> {
  private readonly logger = new Logger(PrintStatsHandler.name);

  constructor(
    private readonly qbus: QueryBus,
    private readonly client: Client,
    private readonly i18n: I18nService,
    private readonly urep: DiscordUserRepository,
  ) {}

  async execute(command: PrintStatsCommand) {
    const channel = (await this.client.channels.resolve(
      command.channel,
    )) as TextChannel;

    const user = this.urep.get(command.discordId);
    if (!user) {
      await channel.send(this.i18n.notFoundAccount());
      return;
    }

    const gameSummary = await this.qbus.execute<GetPlayerInfoQuery, GetPlayerInfoQueryResult>(new GetPlayerInfoQuery(user.playerId, Dota2Version.Dota_681));


    const profile = await this.qbus.execute<GetUserInfoQuery, GetUserInfoQueryResult>(new GetUserInfoQuery(user.playerId))



    await channel.send(
      this.i18n.printStats(
        `${profile.name} (<@${user.discordId}>)`,
        `https://dota2classic.ru/player/${steamIdToNum(user.playerId.value)}`,
        profile.avatar,
        gameSummary.mmr,
        gameSummary.summary.rank,
        gameSummary.summary.totalWinrate,
        gameSummary.summary.rankedGamesPlayed,
        gameSummary.summary.bestHeroes,
        command.full
      ),
    );
  }
}
