import { QueueMessageSyncModel } from 'queue/model/queue-message-sync.model';
import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { RuntimeRepository } from 'config/runtime-repository';

@Injectable()
export class QueueMessageSyncRepository extends RuntimeRepository<QueueMessageSyncModel, 'mode'>{
  constructor(publisher: EventPublisher) {
    super(publisher);
  }
}
