import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DiscordNewMemberEvent } from "../event/discord-new-member.event";
import { Client } from "discord.js";

@EventsHandler(DiscordNewMemberEvent)
export class DiscordNewMemberHandler implements IEventHandler<DiscordNewMemberEvent> {
  constructor(private client: Client) {}

  async handle(event: DiscordNewMemberEvent) {
    const u = this.client.users.resolve(event.id)

    await u.send(`Привет! Я здесь, чтобы помочь тебе начать играть в классическую Dota 2!
Для того, чтобы начать играть, нужно только начать поиск на нашем сайте https://dota2classic.ru/queue
Игра начнется, когда наберется 10 человек и все примут игру
Для более подробного гайда, напиши мне !помощь`)
  }
}
