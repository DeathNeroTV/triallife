import alt from 'alt-server';
import { triallife } from '../../../../../server/api/triallife';
import { command } from '../../../../../server/decorators/commands';
import { AdminController } from '../../../../../server/systems/admin';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';

class PlayersCommand {
    @command('sethealth', '/sethealth [value] [id]', PERMISSIONS.ADMIN)
    private static setHealthCommand(player: alt.Player, value: number = 100, id: string | null = null): void {
        if (isNaN(value)) {
            return;
        }

        if (value < 99) value = 99;
        if (value > 199) value = 199;

        if (id === null || id === undefined) {
            PlayersCommand.finishSetHealth(player, value);
            return;
        }

        const target = triallife.systems.identifier.getPlayer(id);
        if (!target) {
            triallife.player.emit.notification(player, 'Cannot find player with that ID.');
            return;
        }

        PlayersCommand.finishSetHealth(target, value);
    }

    @command('setarmour', '/setarmour [value] [id]', PERMISSIONS.ADMIN)
    private static setArmourCommand(player: alt.Player, value: number = 100, id: string | null = null): void {
        if (isNaN(value)) {
            return;
        }

        if (value < 0) value = 0;
        if (value > 100) value = 100;

        if (id === null || id === undefined) {
            PlayersCommand.finishSetArmour(player, value);
            return;
        }

        const target = triallife.systems.identifier.getPlayer(id);
        if (!target) {
            triallife.player.emit.notification(player, 'Cannot find player with that ID.');
            return;
        }

        PlayersCommand.finishSetArmour(target, value);
    }

    @command('freeze', '/freeze <ID> - Freeze the specified player by ID', PERMISSIONS.ADMIN)
    private static freezeCommand(player: alt.Player, id: number) {
        const target = triallife.systems.identifier.getPlayer(id);

        if (!target || !target.valid) return;

        triallife.player.safe.setPosition(target, target.pos.x, target.pos.y, target.pos.z);
        triallife.player.set.frozen(target, true);
        triallife.player.emit.notification(player, `Froze ${target.data.name} successfully!`);
    }

    @command('unfreeze', '/unfreeze <ID>', PERMISSIONS.ADMIN)
    private static unfreezeCommand(player: alt.Player, id: number) {
        const target = triallife.systems.identifier.getPlayer(id);

        if (!target || !target.valid) return;

        triallife.player.set.frozen(target, false);
        triallife.player.emit.notification(player, `Unfroze ${target.data.name} successfully!`);
    }

    @command('kick', '/kick <ID> <REASON>', PERMISSIONS.ADMIN)
    private static kickCommand(player: alt.Player, id: number, ...reason: string[]) {
        const target = triallife.systems.identifier.getPlayer(id);

        if (!target || !target.valid) return;

        if (target.accountData.permissionLevel >= PERMISSIONS.ADMIN) {
            triallife.player.emit.notification(player, `This person can't be kicked.`);
            return;
        }

        target.kick(`You are kicked from the server by ${player.data.name} | Reason: ${reason}`);
    }

    @command('ban', '/ban <ID> <REASON> - Bans a player.', PERMISSIONS.ADMIN)
    private static async banCommand(player: alt.Player, id: number, reason: string) {
        const target = triallife.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) return;

        if (target.accountData.permissionLevel >= PERMISSIONS.ADMIN) {
            triallife.player.emit.notification(player, `This person can't be kicked.`);
            return;
        }

        triallife.player.emit.notification(player, `${target.data.name} was banned from the Server.`);
        target.kick(`You were banned from the Server - ${reason}`);
        await triallife.database.funcs.updatePartialData(target.accountData._id, { banned: true, reason: reason }, triallife.database.collections.Accounts);
    }

    @command('unban', '/unban <DISCORDIDENTIFIER> - Unbans a player by discord ID', PERMISSIONS.ADMIN)
    private static unbanCommand(player: alt.Player, discordIdentifier: string) {
        if (!player || !player.valid) {
            return;
        }
        const unbanned = AdminController.unbanPlayer(discordIdentifier);
        if (unbanned) {
            triallife.player.emit.notification(player, `Unbanned ${discordIdentifier} (Discord)`);
            alt.logWarning(`${discordIdentifier} (Discord) was unbanned by ${player.data.name}`);
            return;
        }
        triallife.player.emit.notification(player, `Could not find that account with Discord ID: ${discordIdentifier}`);
    }

    @command('makeAdmin', '/makeAdmin <ID> - Add permission specified player.', PERMISSIONS.ADMIN)
    private static async makeAdminCommand(player: alt.Player, id: number | string, permissionLevel: number) {
        if (!player || !player.valid) return;

        const target = triallife.systems.identifier.getPlayer(id);
        if (!target) {
            triallife.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
            return;
        }

        target.accountData.permissionLevel = permissionLevel;

        await triallife.database.funcs.updatePartialData(target.accountData._id, { permissionLevel: target.accountData.permissionLevel }, triallife.database.collections.Accounts);
        alt.logWarning(`(${target.data.name}) had their permission level changed to: ${permissionLevel}.`);
    }

    @command('info', '/info <ID> - Get account info for the specified id.', PERMISSIONS.ADMIN)
    private static infoCommand(player: alt.Player, id: number) {
        const target = triallife.systems.identifier.getPlayer(id);

        if (!target || !target.valid) return;

        if (!target.accountData) {
            triallife.player.emit.notification(player, `Could not find account info for ${id}!`);
        }

        const dataToSend = [];

        dataToSend.push(`--- INFO FOR ${target.data.name} ---`);
        dataToSend.push(`ACCOUNT: ${target.data.account_id.toString()}`);

        if (target.accountData && target.accountData.discord) {
            dataToSend.push(`DISCORD: ${target.accountData.discord}`);
        }

        dataToSend.push(`IPs: ${JSON.stringify(target.accountData.ips)}`);
        dataToSend.push(`PERMISSION LEVEL: ${target.accountData.permissionLevel}`);
        dataToSend.push(`HARDWARE: ${target.accountData.hardware}`);
        dataToSend.push(`--- --- ---`);

        for (const element of dataToSend) {
            triallife.player.emit.notification(player, element);
        }
    }

    private static finishSetHealth(target: alt.Player, value: number) {
        triallife.player.safe.addHealth(target, value, true);
        triallife.player.emit.notification(target, `Player health was set to ${value}`);
    }

    private static finishSetArmour(target: alt.Player, value: number) {
        triallife.player.safe.addArmour(target, value, true);
        triallife.player.emit.notification(target, `Player armour was set to ${value}`);
    }

    @command('tempcomponent', '/tempcomponent id num', PERMISSIONS.ADMIN)
    private static setComponent(player: alt.Player, id: string, value: string) {
        if (typeof id === 'undefined' || typeof value === 'undefined') {
            triallife.player.emit.notification(player, `Must provide id, and value.`);
            return;
        }

        try {
            player.setClothes(parseInt(id), parseInt(value), 0, 0);
            triallife.player.emit.notification(player, `Successfully set temp component - ${id} ${value}`);
        } catch (err) {
            triallife.player.emit.notification(player, err.toString());
        }
    }

    @command('tempprop', '/tempprop id num', PERMISSIONS.ADMIN)
    private static setProp(player: alt.Player, id: string, value: string) {
        if (typeof id === 'undefined' || typeof value === 'undefined') {
            triallife.player.emit.notification(player, `Must provide id, and value.`);
            return;
        }

        try {
            player.setProp(parseInt(id), parseInt(value), 0);
            triallife.player.emit.notification(player, `Successfully set temp prop - ${id} ${value}`);
        } catch (err) {
            triallife.player.emit.notification(player, err.toString());
        }
    }
}
