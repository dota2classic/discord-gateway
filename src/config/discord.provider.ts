import { Client, Guild } from 'discord.js';
import { DISCORD_API_TOKEN, DISCORD_SERVER_ID } from 'config/env';
import { Logger } from '@nestjs/common';

export const GuildProvider = {
  provide: Guild,
  useFactory: async (client: Client) => {
    return client.guilds.resolve(DISCORD_SERVER_ID());
  },
  inject: [Client],
};

export const ClientProvider = {
  provide: Client,
  useFactory: async () => {
    const client = new Client();

    const logger = new Logger(Client.name);

    await client.login(DISCORD_API_TOKEN());

    let resolve: () => void;
    const readyPromise = new Promise(r => {
      resolve = r;
    });

    client.on('ready', async () => {
      await client.user!!.setStatus('online');
      await client.user!!.setActivity({
        name: '!help команды',
      });
      logger.log('Client ready and operating.');
      resolve();
    });

    await readyPromise;

    return client;
  },
};
// },
