import {Client} from "discord.js";
import {Injectable, Logger} from '@nestjs/common';
import {EventBus} from '@nestjs/cqrs';

@Injectable()
export class ReadyCheckService {
  private readonly logger = new Logger(ReadyCheckService.name);

  constructor(private client: Client, private readonly ebus: EventBus) {}

  // private async readyCheck(event: GameFoundEvent) {}

  async launchReadyChecks() {
    // new DMReadyCheck(room, MMConfig.LOBBY_ACCEPT_TIMEOUT)
    //   .ask(this.client.users.resolve(it.id)!!, (u, res) => {
    //     const qp = QueuePlayer.Discord(u.id);
    //     this.logger.log(
    //       `Got answer from ${discordName(
    //         it.id,
    //         this.client,
    //       )}. Answer is ${res}`,
    //     );
    //     if (res === DMReadyCheck.yes) {
    //       this.ebus.publish()
    //       room.setReadyState(qp, ReadyState.READY);
    //     } else if (res === DMReadyCheck.no) {
    //       room.setReadyState(qp, ReadyState.DECLINE);
    //     } else {
    //       room.setReadyState(qp, ReadyState.TIMEOUT);
    //     }
    //   })
    //   .catch(() => {
    //     this.logger.error(
    //       `${discordName(
    //         it.id,
    //         this.client,
    //       )}: Can't send messages. Instant decline`,
    //     );
    //
    //     room.setReadyState(
    //       QueuePlayer.Discord(it.id),
    //       ReadyState.DECLINE,
    //     );
    //   })
  }
}
