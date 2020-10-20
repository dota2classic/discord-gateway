import { QueueMessageModel } from 'queue/model/queue-message.model';
import {DB_HOST, DB_PASSWORD, DB_USERNAME} from "./env";
import {ChannelModel} from "../discord/model/channel.model";

export const Entities = [
  QueueMessageModel,
  ChannelModel
]
export const devDbConfig: any = {
  type: 'postgres',
  database: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  entities: Entities,
  synchronize: true,

  keepConnectionAlive: true,
};

export const testDbConfig: any = {
  type: 'sqlite',
  database: ':memory:',
  entities: Entities,
  synchronize: true,
  keepConnectionAlive: true,
};

export const prodDbConfig: any = {
  type: 'postgres',
  database: 'postgres',
  host: DB_HOST(),
  port: 5432,
  username: DB_USERNAME(),
  password: DB_PASSWORD(),
  entities: Entities,
  synchronize: true,
  ssl: false,
};