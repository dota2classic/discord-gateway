import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class GatewayController {
  @EventPattern('GatewayQueueUpdatedEvent')
  async GatewayQueueUpdatedEvent(data: any) {

  }
}
