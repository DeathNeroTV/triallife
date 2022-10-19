import * as alt from 'alt-server';
import { triallife } from '../../../../server/api/triallife';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { ConsoleCommander } from '../../../../shared/utility/consoleCommander';
import { LOCALE_DISCORD_ALLOW_LIST } from '../config/locales';
import { DiscordController } from './discordController';

export class DiscordCommands {
    static init() {
        ConsoleCommander.registerConsoleCommand('/addallowlist', DiscordCommands.addAllowListConsoleCommand);
        ConsoleCommander.registerConsoleCommand('/removeallowlist', DiscordCommands.removeAllowListConsoleCommand);
    }

    private static async addAllowListCommand(player: alt.Player, discord: string) {
        if (!discord) {
            return;
        }

        if (discord.length <= 17) {
            triallife.player.emit.notification(player, LOCALE_DISCORD_ALLOW_LIST.ID_NOT_LONG_ENOUGH);
            return;
        }

        const member = await DiscordController.addToAllowList(discord);
        if (!member) {
            triallife.player.emit.notification(player, `{FF0000}${LOCALE_DISCORD_ALLOW_LIST.USER_WAS_NOT_IN_DISCORD}`);
            return;
        }

        triallife.player.emit.notification(
            player,
            `{00FF00}${LOCALE_DISCORD_ALLOW_LIST.ADD_TO_ALLOW_LIST} ${member.user.username}#${member.user.discriminator} (${member.user.id})`,
        );
    }

    private static async removeAllowlistCommand(player: alt.Player, discord: string) {
        if (!discord) {
            return;
        }

        if (discord.length <= 17) {
            triallife.player.emit.notification(player, LOCALE_DISCORD_ALLOW_LIST.ID_NOT_LONG_ENOUGH);
            return;
        }

        const member = await DiscordController.removeFromAllowList(discord);
        if (!member) {
            triallife.player.emit.notification(player, `{FF0000}${LOCALE_DISCORD_ALLOW_LIST.USER_WAS_NOT_IN_DISCORD}`);
            return;
        }

        triallife.player.emit.notification(
            player,
            `{FFFF00} ${LOCALE_DISCORD_ALLOW_LIST.REMOVE_FROM_ALLOW_LIST} ${member.user.username}#${member.user.discriminator} (${member.user.id})`,
        );
    }

    private static async addAllowListConsoleCommand(discord: string) {
        if (discord === undefined) {
            alt.logWarning(`/addallowlist <discord_id>>`);
            return;
        }

        const member = await DiscordController.addToAllowList(discord);
        if (!member) {
            alt.log(`~lr~[Discord] Could not find that user in discord.`);
            return;
        }

        alt.log(`~c~[Discord] Added to the allow list. ${member.user.username}#${member.user.discriminator}`);
    }

    private static async removeAllowListConsoleCommand(discord: string) {
        if (discord === undefined) {
            alt.logWarning(`/removeallowlist <discord_id>>`);
            return;
        }

        const member = await DiscordController.removeFromAllowList(discord);
        if (!member) {
            alt.log(`~lr~[Discord] Could not find that user in discord.`);
            return;
        }

        alt.log(`~c~[Discord] Removed from the allow list. ${member.user.username}#${member.user.discriminator}`);
    }
}
