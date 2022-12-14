import alt from 'alt-server';
import { triallife } from '../../../../../server/api/triallife';
import { command } from '../../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';

class TeleportCommands {
    @command('gethere', '/gethere <ID> - Teleports a player to your position.', PERMISSIONS.ADMIN)
    private static GetHereCommand(player: alt.Player, id: number) {
        const target = triallife.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id || target === player) return;

        triallife.player.safe.setPosition(target, player.pos.x + 1, player.pos.y, player.pos.z);
        triallife.player.emit.notification(player, `Successfully teleported ${target.data.name} to your position!`);
    }

    @command('goto', '/goto <ID> - Teleports you to the specified player.', PERMISSIONS.ADMIN)
    private static goToCommand(player: alt.Player, id: number) {
        const target = triallife.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id || target === player) return;

        triallife.player.safe.setPosition(player, target.pos.x + 1, target.pos.y, target.pos.z);
    }

    @command('tpwp', LocaleController.get(LOCALE_KEYS.COMMAND_TELEPORT_WAYPOINT, '/tpwp'), PERMISSIONS.ADMIN)
    private static tpWpCommand(player: alt.Player) {
        if (!player.currentWaypoint) {
            triallife.player.emit.notification(player, `Set a waypoint first.`);
            return;
        }

        triallife.player.safe.setPosition(player, player.currentWaypoint.x, player.currentWaypoint.y, player.currentWaypoint.z);
    }

    @command('coords', LocaleController.get(LOCALE_KEYS.COMMAND_COORDS, '/coords'), PERMISSIONS.ADMIN)
    private static handleCommand(player: alt.Player, x: string, y: string, z: string): void {
        try {
            triallife.player.safe.setPosition(player, parseFloat(x), parseFloat(y), parseFloat(z));
        } catch (err) {}
    }

    @command('getcar', '/getcar [id]', PERMISSIONS.ADMIN)
    private static handleGetCar(player: alt.Player, id: string): void {
        const tmpID = parseInt(id);
        if (isNaN(tmpID)) {
            return;
        }

        // Find the vehicle
        const validVehicle = alt.Vehicle.all.find((veh) => {
            if (!veh || !veh.valid) {
                return false;
            }

            return veh.id === tmpID;
        });

        // no spawned vehicle was found
        if (!validVehicle || !validVehicle.valid) {
            return;
        }

        // Move the vehicle to the player.
        validVehicle.pos = player.pos;

        // Check if it is saveable.
        if (!validVehicle.data) {
            return;
        }

        validVehicle.data.position = validVehicle.pos;
        triallife.vehicle.funcs.save(validVehicle, { position: validVehicle.pos });
    }

    @command('tpto', '/tpto <partial_name>', PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR)
    private static handleTeleportTo(player: alt.Player, name: string) {
        if (!name) {
            triallife.player.emit.notification(player, `tpto <partial_name>`);
            return;
        }

        if (name.includes('_')) {
            name = name.replace('_', '');
        }

        const target = alt.Player.all.find((p) => p && p.data && p.data.name.replace('_', '').toLowerCase().includes(name));

        if (!target || !target.valid) {
            triallife.player.emit.notification(player, `Could not find that player.`);
            return;
        }

        if (player.vehicle) {
            player.vehicle.pos = target.pos;
            return;
        }

        triallife.player.safe.setPosition(player, target.pos.x, target.pos.y, target.pos.z);
    }

    @command('tphere', '/tphere <partial_name>', PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR)
    private static handleTeleportHere(player: alt.Player, name: string) {
        if (!name) {
            triallife.player.emit.notification(player, `tpto <partial_name>`);
            return;
        }

        if (name.includes('_')) {
            name = name.replace('_', '');
        }

        const target = alt.Player.all.find((p) => p && p.data && p.data.name.replace('_', '').toLowerCase().includes(name));

        if (!target || !target.valid) {
            triallife.player.emit.notification(player, `Could not find that player.`);
            return;
        }

        if (target.vehicle) {
            target.vehicle.pos = player.pos;
            return;
        }

        triallife.player.safe.setPosition(target, player.pos.x, player.pos.y, player.pos.z);
    }

    @command('tpall', '/tpall', PERMISSIONS.ADMIN)
    private static handleTeleportAll(player: alt.Player) {
        alt.Player.all.forEach((target) => {
            if (!target || !target.valid || !target.data || !target.data._id) {
                return;
            }

            triallife.player.safe.setPosition(target, player.pos.x, player.pos.y, player.pos.z);
        });
    }
}
