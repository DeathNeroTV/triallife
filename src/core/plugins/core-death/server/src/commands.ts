import * as alt from 'alt-server';
import { triallife } from '../../../../server/api/triallife';
import { command } from '../../../../server/decorators/commands';
import { DEFAULT_CONFIG } from '../../../../server/triallife/main';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../shared/locale/locale';
import { DeathSystem } from './death';

export class DeathCommands {
    static init() {}

    @command('revive', LocaleController.get(LOCALE_KEYS.COMMAND_REVIVE, '/revive'), PERMISSIONS.ADMIN)
    private static handleRevive(player: alt.Player, id: string | null = null): void {
        if (id === null || id === undefined) {
            if (!player.data.isDead) {
                return;
            }

            triallife.player.set.respawned(player, player.pos);
            return;
        }

        const target = triallife.systems.identifier.getPlayer(id);
        if (!target) {
            triallife.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
            return;
        }

        if (!target.data.isDead) {
            return;
        }

        triallife.player.set.respawned(target, target.pos);
    }

    @command(['acceptdeath', 'respawn'], LocaleController.get(LOCALE_KEYS.COMMAND_ACCEPT_DEATH, '/acceptdeath'), PERMISSIONS.NONE)
    static handleCommand(player: alt.Player): void {
        if (!player || !player.valid) {
            return;
        }

        if (!player.data.isDead) {
            return;
        }

        const timeInFuture = DeathSystem.getRespawnTime(player);
        if (typeof timeInFuture === 'undefined') {
            return;
        }

        if (Date.now() < timeInFuture) {
            return;
        }
        const position = triallife.player.get.closestRespawn(player);
        triallife.player.set.respawned(player, position);
    }
}
