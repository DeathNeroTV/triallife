import * as alt from 'alt-server';
import { triallife } from '../../../../server/api/triallife';
import { Vehicle_Behavior, VEHICLE_STATE } from '../../../../shared/enums/vehicle';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { ConsoleCommander } from '../../../../shared/utility/consoleCommander';
import { isFlagEnabled } from '../../../../shared/utility/flags';
import { FUEL_CONFIG } from './config';

function setFuel(cmdName: string, ...args: string[]) {
    let actualAmount = parseInt(args[0]);

    if (typeof actualAmount !== 'number') {
        triallife.player.emit.notification(player, `Invalid amount to fuel to.`);
        return;
    }

    if (actualAmount > FUEL_CONFIG.MAXIMUM_FUEL) {
        actualAmount = FUEL_CONFIG.MAXIMUM_FUEL;
    }

    if (!player.vehicle) {
        triallife.player.emit.notification(player, `Must be in a vehicle.`);
        return;
    }

    if (!isFlagEnabled(player.vehicle.data.behavior, Vehicle_Behavior.CONSUMES_FUEL)) {
        return;
    }

    player.vehicle.data.fuel = actualAmount;
    player.vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, player.vehicle.data.fuel);
    player.vehicle.setSyncedMeta(VEHICLE_STATE.POSITION, player.vehicle.pos);
    triallife.vehicle.funcs.save(player.vehicle, { fuel: player.vehicle.data.fuel });
}

export class FuelCommands {
    static init() {
        ConsoleCommander.registerConsoleCommand('setfuel', '/setfuel [amount]', setFuel);
    }
}
