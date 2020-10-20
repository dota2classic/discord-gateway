import {Injectable} from "@nestjs/common";
import {RuntimeRepository} from "../../config/runtime-repository";
import {EventPublisher} from "@nestjs/cqrs";
import {LiveMatchModel} from "../model/live-match.model";

@Injectable()
export class LiveMatchRepository extends RuntimeRepository<
  LiveMatchModel,
  'matchId'
  > {
  constructor(publisher: EventPublisher) {
    super(publisher);
  }
}