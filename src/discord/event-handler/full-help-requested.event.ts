import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FullHelpRequestedEvent } from "../event/full-help-requested.event";
import { Client } from "discord.js";

@EventsHandler(FullHelpRequestedEvent)
export class FullHelpRequestedHandler implements IEventHandler<FullHelpRequestedEvent> {
  constructor(private client: Client) {}

  async handle(event: FullHelpRequestedEvent) {


    const u = this.client.users.resolve(event.id);

    await u.send(`Как играть:

1. Скачайте клиент Dota 2 Classic 6.81b в канале #скачать 
2. Авторизуйтесь на нашем сайте через steam https://dota2classic.ru
3. На странице поиска игры https://dota2classic.ru/queue выберите режим и нажмите "Начать поиск".  Если закрыть вкладку, Вы будете убраны из поиска через минуту.
4. Запустите и войдите в Steam
5. Когда найдется игра, на сайте заиграет звук найденной игры и нужно будет принять игру.
6. Запустите игру через файл \`dota.exe\`, находящийся в папке \`Dota 2 Classic 6.81b\`
7. Когда все 10 человек примут игру, по кнопке "Присоединиться к игре" можно подключиться к игре.

Обычно игры идут вечером, начиная с 17:00 по МСК.

**ВНИМАНИЕ! 
НЕ НУЖНО НАЖИМАТЬ КНОПКУ "НАЙТИ ИГРУ" В СТАРОМ КЛИЕНТЕ.  
ВЫ ПОЛУЧИТЕ БАН ПОИСКА В АКТУАЛЬНОЙ ВЕРСИИ DOTA 2.**

Если у тебя возникли сложности, спокойно задавай вопросы в чате нашего сервера, если будем онлайн - ответим.`)
  }
}
