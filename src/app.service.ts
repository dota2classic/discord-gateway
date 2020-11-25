import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EventBus } from "@nestjs/cqrs";
import { EngageNeededEvent } from "./discord/event/engage-needed.event";

@Injectable()
export class AppService {
  constructor(private readonly ebus: EventBus) {}
  @Cron('0 */30 12-23 * * *')
  async engageGame() {
    this.ebus.publish(new EngageNeededEvent());
  }
}
