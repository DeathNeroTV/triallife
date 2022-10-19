import * as alt from 'alt-server';
import { triallife } from '../../../../../server/api/triallife';
import { command } from '../../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';

const parkingList = [];

class GarageCommands {
    @command('addparking', '/addparking - Add parking to a temporary list.', PERMISSIONS.ADMIN)
    private static addParkingCommand(player: alt.Player) {
        parkingList.push({ position: player.pos, rotation: player.rot });
        triallife.player.emit.notification(player, `Appended parking to temporary list.`);
    }

    @command('removeparking', '/removeparking - Remove last element from parking list.', PERMISSIONS.ADMIN)
    private static removeParkingCommand(player: alt.Player) {
        parkingList.pop();
        triallife.player.emit.notification(player, `Removed last element from temporary list.`);
    }

    @command('clearparking', '/clearparking - Clear Temporary List', PERMISSIONS.ADMIN)
    private static clearParkingCommand(player: alt.Player) {
        while (parkingList.length >= 1) {
            parkingList.pop();
        }

        triallife.player.emit.notification(player, `Cleared temporary parking list.`);
    }

    @command('printparking', '/printparking - Print Temporary List', PERMISSIONS.ADMIN)
    private static printParkingCommand(player: alt.Player) {
        triallife.player.emit.notification(player, `Printed to Server Console`);
        console.log(JSON.stringify(parkingList, null, '\t'));
    }
}
