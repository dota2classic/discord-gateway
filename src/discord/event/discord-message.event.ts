import { Message } from 'discord.js';

// not sure if its a good idea
export class DiscordMessageEvent {
  constructor(public readonly message: Message) {}
}
