
export const Entities = [

]
export const devDbConfig: any = {
  type: 'sqlite',
  database: ':memory:',
  entities: Entities,
  synchronize: true,
  keepConnectionAlive: true,
};

export const prodDbConfig: any = {
  type: 'postgres',
  database: 'postgres',
  host: 'discord-gateway-db',
  port: 5432,
  username: 'postgres',
  password: 'tododododoood',
  entities: Entities,
  synchronize: true,

  ssl: false,
};