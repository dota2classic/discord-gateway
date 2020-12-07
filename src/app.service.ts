import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { EventBus } from "@nestjs/cqrs";
import { EngageNeededEvent } from "./discord/event/engage-needed.event";
import { QueueUpdatedEvent } from "./gateway/events/queue-updated.event";
import { MatchmakingMode } from "./gateway/shared-types/matchmaking-mode";

@Injectable()
export class AppService {
  constructor(private readonly ebus: EventBus) {}
  @Cron('0 */30 12-23 * * *')
  async engageGame() {
    // this.ebus.publish(new EngageNeededEvent());
  }

  // each minute
  @Cron('0 */1 * * * *')
  async updateBotQueue() {
    this.ebus.publish(new QueueUpdatedEvent(MatchmakingMode.BOTS));
  }
}
