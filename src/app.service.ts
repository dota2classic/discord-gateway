import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { QueueUpdatedEvent } from './gateway/events/queue-updated.event';
import { MatchmakingMode } from './gateway/shared-types/matchmaking-mode';
import { GetRoleSubscriptionsQuery } from './gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query';
import { GetRoleSubscriptionsQueryResult } from './gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions-query.result';
import { DiscordUserRepository } from './discord/repository/discord-user.repository';
import { Client, Guild, Snowflake, TextChannel } from 'discord.js';
import { Role } from './gateway/shared-types/roles';
import { PlayerId } from './gateway/shared-types/player-id';

@Injectable()
export class AppService {
  constructor(
    private readonly ebus: EventBus,
    private readonly qbus: QueryBus,
    private readonly userRep: DiscordUserRepository,
    private readonly client: Client,
    private readonly guild: Guild,
  ) {}
  @Cron('0 */30 12-23 * * *')
  async engageGame() {
    // this.ebus.publish(new EngageNeededEvent());
  }

  // each minute
  @Cron('0 */1 * * * *')
  async updateBotQueue() {
    this.ebus.publish(new QueueUpdatedEvent(MatchmakingMode.BOTS));
  }

  private async clearWrongRoles(
    discordRoleId: Snowflake,
    roles: GetRoleSubscriptionsQueryResult,
    targetRole: Role,
  ) {
    const ch = this.guild.channels.resolve('720288829029744740') as TextChannel;
    const roleName = this.guild.roles.cache.get(discordRoleId).name;

    const discordUsersWithRole = this.guild.members.cache.filter(
      mem => !!mem.roles.cache.find(t => t.id === discordRoleId),
    );

    let removedRoles = 0;

    await Promise.all(
      discordUsersWithRole.map(async discordUserWithRole => {
        const du = this.userRep.get(discordUserWithRole.user.id);
        if (!du) {
          // if there is no user in sync, we remove role
          await discordUserWithRole.roles.remove(discordRoleId);
          removedRoles++;
          await ch.send(
            `Убрал роль ${roleName} <@${discordUserWithRole.user.id}>`,
          );
          return;
        }
        const rolesSet = roles.entries.find(
          t => t.steam_id === du.playerId.value,
        );

        if (!rolesSet) {
          // this dude doesn't even have a record, remove em
          await discordUserWithRole.roles.remove(discordRoleId);
          removedRoles++;
          await ch.send(
            `Убрал роль ${roleName} <@${discordUserWithRole.user.id}>`,
          );
          return;
        }
        const roleLifetime = rolesSet.entries.find(t => t.role === targetRole);
        if (roleLifetime && roleLifetime.end_time > new Date().getTime()) {
          // if not expired all good
        } else {
          await discordUserWithRole.roles.remove(discordRoleId);
          removedRoles++;
          await ch.send(
            `Убрал роль ${roleName} <@${discordUserWithRole.user.id}>`,
          );
        }
      }),
    );

    console.log(
      `Removed a total of ${removedRoles} where they don't match entries. Role: ${
        this.guild.roles.cache.get(discordRoleId).name
      }`,
    );
  }

  private async addRoles(
    discordRoleId: Snowflake,
    roles: GetRoleSubscriptionsQueryResult,
    targetRole: Role,
  ) {
    const ch = this.guild.channels.resolve('720288829029744740') as TextChannel;
    const roleName = this.guild.roles.cache.get(discordRoleId).name;
    let rolesAdded = 0;
    await Promise.all(
      roles.entries.map(async role => {
        const du = this.userRep.findByPlayerId(new PlayerId(role.steam_id));
        if (!du) return;

        const member = this.guild.members.cache.find(
          t => t.user.id === du.discordId,
        );

        if (member) {
          try {
            const roleEntry = role.entries.find(t => t.role === targetRole);
            if (roleEntry && roleEntry.end_time > new Date().getTime()) {
              if (!member.roles.cache.find(t => t.id === discordRoleId)) {
                await member.roles.add(discordRoleId);
                rolesAdded++;
                await ch.send(
                  `Добавил роль ${roleName} <@${member.user.id}>`,
                );
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      }),
    );

    console.log(
      `Added a total of ${rolesAdded} where they don't match entries. Role: ${
        this.guild.roles.cache.get(discordRoleId).name
      }`,
    );
  }

  // every hour
  @Cron('0 * * * *')
  async syncRoles() {
    console.log(`Starting syncRoles task`);
    const OLD_ROLE_ID = '726917935117107212';
    const HUMAN_ROLE_ID = '682939251499073587';
    const roles = await this.qbus.execute<
      GetRoleSubscriptionsQuery,
      GetRoleSubscriptionsQueryResult
    >(new GetRoleSubscriptionsQuery());

    const label = `SyncRoles ${new Date().getTime()}`;
    console.time(label);

    await this.clearWrongRoles(OLD_ROLE_ID, roles, Role.OLD);
    await this.clearWrongRoles(HUMAN_ROLE_ID, roles, Role.HUMAN);

    // these are compute-heavy boys, much complexity cause i suck
    await this.addRoles(OLD_ROLE_ID, roles, Role.OLD);
    await this.addRoles(HUMAN_ROLE_ID, roles, Role.HUMAN);

    console.timeEnd(label);
  }
}
