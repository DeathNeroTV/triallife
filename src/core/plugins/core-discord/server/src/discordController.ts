import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { ActivityType, Client, Embed, GatewayIntentBits, Guild, GuildMember, TextChannel } from 'discord.js';
import { triallife } from '../../../../server/api/triallife';
import { Account } from '../../../../server/interface/iAccount';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { DiscordUser } from '../../../../server/interface/iDiscordUser';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { DISCORD_LOGIN_EVENTS } from '../../../core-discord-login/shared/events';
import { LOCALE_DISCORD_ALLOW_LIST } from '../config/locales';

const client: Client<boolean> = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers],
});

export class DiscordController {
    static willBeReady = false;
    static serverId: string;
    static allowListRole: string;
    static guild: Guild;
    static teamRoles: Array<{ role: string; permission: PERMISSIONS }> = [
        { role: '814092562792579103', permission: PERMISSIONS.NONE }, //MG | Mitglied
        { role: '884178966817148939', permission: PERMISSIONS.VIP }, //MG | Contributer
        { role: '814096533402026014', permission: PERMISSIONS.MODERATOR }, //MG | Moderator
        { role: '814096533402026014', permission: PERMISSIONS.ADMIN }, //MG | Administrator
        { role: '814086417030316053', permission: PERMISSIONS.OWNER }, //MG | Inhaber
    ];

    static init(_token: string, _serverId: string): void {
        DiscordController.serverId = _serverId;
        alt.on('playerConnect', DiscordController.earlyConnections);
        client.on('ready', DiscordController.ready);
        client.login(_token);
    }

    static dispose() {
        client.destroy();
    }

    static async earlyConnections(player: alt.Player): Promise<void> {
        if (DiscordController.willBeReady) {
            alt.off('playerConnect', DiscordController.earlyConnections);
            return;
        }

        player.kick(LOCALE_DISCORD_ALLOW_LIST.SERVER_STILL_WARMING_UP);
    }

    static async initAllowList(_allowListRole: string): Promise<void> {
        if (!_allowListRole) {
            alt.log(`~lr~[Discord] Missing role identification for allow list.`);
            return;
        }

        DiscordController.allowListRole = _allowListRole;

        const role = await DiscordController.guild.roles.fetch(DiscordController.allowListRole);
        if (!role) {
            alt.log(`~lr~[Discord] Could not find the allow list role specified in config. Plugin disabled.`);
            client.destroy();
            return;
        }
        client.on('guildMemberUpdate', DiscordController.userUpdate);
        triallife.injections.login.tryLogin('login-try-account-begin', DiscordController.tryLogin);
    }

    static async ready(): Promise<void> {
        DiscordController.guild = await client.guilds.fetch(DiscordController.serverId);
        if (!DiscordController.guild) {
            alt.log(`~lr~[Discord] Could not find the server id specified in config. Plugin disabled.`);
            client.destroy();
            return;
        }
        DiscordController.willBeReady = true;
        client.user.setActivity('alt:V - Trial Life Roleplay', { type: ActivityType.Playing });
    }

    static async isReady(): Promise<unknown> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!DiscordController.willBeReady) {
                    return;
                }
                resolve();
                alt.clearInterval(interval);
            }, 500);
        });
    }

    static async getUserByID(player: alt.Player, id: string): Promise<boolean> {
        let member = DiscordController.guild.members.cache.get(id);
        if (!member) {
            triallife.webview.emit(player, DISCORD_LOGIN_EVENTS.TO_WEBVIEW.SET_ERROR_MESSAGE, 'Sie haben bei uns kein Konto!');
            return false;
        }
        if (!member.roles.cache.get('814081061889114162')) {
            triallife.webview.emit(player, DISCORD_LOGIN_EVENTS.TO_WEBVIEW.SET_ERROR_MESSAGE, 'Sie sind noch nicht freigeschaltet!');
            return false;
        }
        return true;
    }

    static async tryLogin(player: alt.Player, _account: Partial<Account>): Promise<boolean> {
        if (!player || !player.valid) {
            return false;
        }

        if (!player.discord || !player.discord.id) {
            player.kick(LOCALE_DISCORD_ALLOW_LIST.ACCOUNT_NOT_ACCESSIBLE);
            return false;
        }

        const member = DiscordController.guild.members.cache.get(player.discord.id);
        if (!member) {
            player.kick(LOCALE_DISCORD_ALLOW_LIST.USER_WAS_NOT_IN_DISCORD);
            return false;
        }

        const role = DiscordController.guild.roles.cache.get(DiscordController.allowListRole);
        if (!role) {
            player.kick(LOCALE_DISCORD_ALLOW_LIST.NO_ALLOW_LIST_ROLE);
            return false;
        }

        const hasRole = member.roles.cache.get(DiscordController.allowListRole);
        if (!hasRole) {
            player.kick(LOCALE_DISCORD_ALLOW_LIST.NOT_ALLOW_LISTED);
            return false;
        }
        return true;
    }

    static async userUpdate(oldUser: GuildMember, newUser: GuildMember): Promise<void> {
        const discord = oldUser.id;
        const oldUserHasRole = oldUser.roles.cache.has(DiscordController.allowListRole);
        const newUserHasRole = newUser.roles.cache.has(DiscordController.allowListRole);
        const oldTeamHasRole = DiscordController.teamRoles.find((x) => oldUser.roles.cache.has(x.role));
        const newTeamHasRole = DiscordController.teamRoles.find((x) => newUser.roles.cache.has(x.role));
        const name = `${newUser.user.username}#${newUser.user.discriminator}`;

        // Handle Allow List
        if (oldUserHasRole && !newUserHasRole) {
            alt.log(`~lc~[Discord] ${name} (${discord}) was removed from the allow list.`);
            await DiscordController.removeFromAllowList(discord, true);
        } else if (!oldUserHasRole && newUserHasRole) {
            alt.log(`~lc~[Discord] ${name} (${discord}) was added to the allow list.`);
            await DiscordController.addToAllowList(oldUser.id, true);
        }
        // Handle Allow List
        if (oldTeamHasRole && !newTeamHasRole) {
            alt.log(`~lc~[Discord] ${name} (${discord}) was removed from the team list.`);
            await DiscordController.removeFromTeam(discord, oldTeamHasRole, true);
        } else if (!oldTeamHasRole && newTeamHasRole) {
            alt.log(`~lc~[Discord] ${name} (${discord}) was added to the team list.`);
            await DiscordController.addToTeam(discord, newTeamHasRole, true);
        }
    }

    static async removeFromAllowList(discord: string, alreadyRemovedRole: boolean = false): Promise<GuildMember> {
        const member = await DiscordController.guild.members.fetch(discord);
        try {
            await member.send(LOCALE_DISCORD_ALLOW_LIST.REMOVE_FROM_ALLOW_LIST);
        } catch (err) {
            alt.log(`~lr~[Discord] An Error occured! ${err}`);
        }
        const existingPlayer = alt.Player.all.find((p) => p && p.accountData && p.accountData.discord === discord);
        if (existingPlayer) existingPlayer.kick(LOCALE_DISCORD_ALLOW_LIST.REMOVE_FROM_ALLOW_LIST);
        if (alreadyRemovedRole) return member;
        if (!member) return member;
        const role = await DiscordController.guild.roles.fetch(DiscordController.allowListRole);
        if (!role) return member;
        return await member.roles.remove(role);
    }

    static async addToAllowList(discord: string, alreadyAddedRole: boolean = false): Promise<GuildMember> {
        const member = await DiscordController.guild.members.fetch(discord);
        try {
            await member.send(LOCALE_DISCORD_ALLOW_LIST.ADD_TO_ALLOW_LIST);
        } catch (err) {
            alt.log(`~lr~[Discord] An Error occured! ${err}`);
        }
        if (alreadyAddedRole) return member;
        if (!member) return member;
        const role = await DiscordController.guild.roles.fetch(DiscordController.allowListRole);
        if (role) return member;
        return await member.roles.add(role);
    }

    static async removeFromTeam(discord: string, perm: { role: string; permission: PERMISSIONS }, alreadyRemovedRole: boolean = false): Promise<GuildMember> {
        const member = await DiscordController.guild.members.fetch(discord);
        try {
            await member.send('Sie wurden vom Server Team entfernt');
        } catch (err) {
            alt.log(`~lr~[Discord] An Error occured! ${err}`);
        }
        const existingPlayer = alt.Player.all.find((p) => p && p.accountData && p.accountData.discord === discord);
        if (existingPlayer) existingPlayer.accountData.permissionLevel = perm.permission;
        else await Database.updateDataByFieldMatch('discord', discord, { permissionLevel: 0 }, Collections.Accounts);
        if (alreadyRemovedRole) return member;
        if (!member) return member;
        const roleTeam = await DiscordController.guild.roles.fetch(perm.role);
        const roleUser = await DiscordController.guild.roles.fetch(DiscordController.teamRoles[0].role);
        await member.roles.remove(roleTeam);
        return await member.roles.add(roleUser);
    }

    static async addToTeam(discord: string, perm: { role: string; permission: PERMISSIONS }, alreadyAddedRole: boolean = false): Promise<GuildMember> {
        const member = await DiscordController.guild.members.fetch(discord);
        try {
            await member.send('Sie wurden dem Server Team hinzugefügt');
        } catch (err) {
            alt.log(`~lr~[Discord] An Error occured! ${err}`);
        }
        const existingPlayer = alt.Player.all.find((p) => p && p.accountData && p.accountData.discord === discord);
        if (existingPlayer) existingPlayer.accountData.permissionLevel = perm.permission;
        else await Database.updateDataByFieldMatch('discord', discord, { permissionLevel: perm.permission }, Collections.Accounts);
        if (alreadyAddedRole) return member;
        if (!member) return member;
        const roleTeam = await DiscordController.guild.roles.fetch(perm.role);
        const roleUser = await DiscordController.guild.roles.fetch(DiscordController.teamRoles[0].role);
        await member.roles.remove(roleUser);
        return await member.roles.add(roleTeam);
    }

    static async sendToChannel(channel_id: string, message: string): Promise<void> {
        if (!DiscordController.guild) {
            alt.logError(`~lr~[Discord] You do not currently have a Discord Bot Setup for sending messages.`);
            return;
        }

        const channel = (await DiscordController.guild.channels.fetch(channel_id)) as TextChannel;
        if (!channel) {
            alt.logError(`~lr~[Discord] Channel does not exist to sendToChannel`);
            return;
        }

        channel.send(message);
    }

    static async sendEmbed(channel_id: string, msg: Embed): Promise<void> {
        if (!DiscordController.guild) {
            alt.logError(`[Discord] You do not currently have a Discord Bot Setup for sending messages.`);
            return;
        }

        const channel = (await DiscordController.guild.channels.fetch(channel_id)) as TextChannel;
        if (!channel) {
            alt.logError(`[Discord] Channel does not exist.`);
            return;
        }

        channel.send({ embeds: [msg] });
    }
}
