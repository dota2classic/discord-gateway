import { RuntimeRepository } from '../../config/runtime-repository';
import { ReadyCheckModel } from '../model/ready-check.model';
import { EventPublisher } from '@nestjs/cqrs';
import {Injectable} from "@nestjs/common";

@Injectable()
export class ReadyCheckRepository extends RuntimeRepository<
  ReadyCheckModel,
  'id'
> {
  constructor(publisher: EventPublisher) {
    super(publisher);
  }
}
