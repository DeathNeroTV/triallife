import * as alt from 'alt-server';
import { getClosestEntity } from '../../../../server/utility/vector';
import { FUEL_STATION_EVENTS } from '../../shared/events';
import { LOCALE_FUEL_STATIONS } from '../../shared/locales';
import { CurrencyTypes } from '../../../../shared/enums/currency';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { Vehicle_Behavior } from '../../../../shared/enums/vehicle';
import { JobTrigger } from '../../../../shared/interfaces/jobTrigger';
import { isFlagEnabled } from '../../../../shared/utility/flags';
import { distance2d } from '../../../../shared/utility/vector';
import { FUEL_CONFIG } from './config';
import stations from './stations';
import { triallife } from '../../../../server/api/triallife';
import { ServerJobTrigger } from '../../../../server/systems/jobTrigger';

const maximumFuel = 100;
const fuelInfo: { [playerID: string]: FuelStatus } = {};

interface FuelStatus {
    vehicle: alt.Vehicle;
    cost: number;
    fuel: number;
    timeout: number;
}

export class FuelStationSystem {
    static init() {
        for (let i = 0; i < stations.length; i++) {
            const fuelPump = stations[i];
            if (fuelPump.isBlip) {
                triallife.controllers.blip.append({
                    text: 'Zapfsäule',
                    color: 1,
                    sprite: 361,
                    scale: 1,
                    shortRange: true,
                    pos: fuelPump,
                    uid: `fuel-${i}`,
                });
            }

            triallife.controllers.interaction.add({
                uid: `fuel-pump-${i}`,
                position: fuelPump,
                description: 'Fahrzeug betanken',
                callback: FuelStationSystem.request,
                isPlayerOnly: true,
                debug: false,
            });
        }
    }

    /**
     * Request to refuel a vehicle.
     * @param {alt.Player} player - alt.Player - The player who is requesting the refuel.
     */
    static request(player: alt.Player) {
        if (fuelInfo[player.id] && Date.now() < fuelInfo[player.id].timeout) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_REFILLING);
            return;
        }
        // Reset fuel timeout if exceeded
        if (fuelInfo[player.id] && Date.now() > fuelInfo[player.id].timeout) {
            delete fuelInfo[player.id];
        }
        const closestVehicle = getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 2, true);
        if (!closestVehicle) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_TOO_FAR_FROM_PUMP);
            return;
        }
        if (!isFlagEnabled(closestVehicle.behavior, Vehicle_Behavior.CONSUMES_FUEL)) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_FULL);
            return;
        }
        if (closestVehicle.engineOn) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_TURN_OFF_ENGINE);
            return;
        }
        if (closestVehicle.isRefueling) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_REFILLING);
            return;
        }
        const dist = distance2d(player.pos, closestVehicle.pos);
        if (dist >= 4) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_TOO_FAR_FROM_PUMP);
            return;
        }
        if (!closestVehicle.data) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_FULL);
            return;
        }
        if (closestVehicle.data.fuel >= 99) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_FULL);
            return;
        }
        const currentFuel = closestVehicle.data.fuel;
        let missingFuel = maximumFuel - currentFuel;
        let maximumCost = missingFuel * FUEL_CONFIG.FUEL_PRICE;
        // re-calculate based on what the player can afford.
        if (player.data.cash < maximumCost) {
            maximumCost = FUEL_CONFIG.FUEL_PRICE * player.data.cash;
            missingFuel = missingFuel - FUEL_CONFIG.FUEL_PRICE * player.data.cash;
            if (missingFuel <= 2) {
                triallife.player.emit.notification(player, `${LOCALE_FUEL_STATIONS.FUEL_CANNOT_AFFORD} ${maximumCost.toFixed(2).replace('.', ',')} $`);
                return;
            }
        }
        const trigger: JobTrigger = {
            header: 'Fuel Vehicle',
            acceptCallback: FuelStationSystem.start,
            cancelCallback: FuelStationSystem.cancel,
            image: '../../assets/images/refuel.jpg',
            summary: `${closestVehicle.data.model} für ${maximumCost.toFixed(2).replace('.', ',')} $ (${missingFuel.toFixed(2)}%) betanken ?`,
        };
        fuelInfo[player.id] = {
            cost: maximumCost,
            fuel: missingFuel,
            vehicle: closestVehicle,
            timeout: Date.now() + FUEL_CONFIG.FUEL_RESET_TIMEOUT,
        };
        ServerJobTrigger.create(player, trigger);
    }

    /**
     * Start the fuel process for the given player.
     * @param {alt.Player} player - alt.Player - The player who started the refueling.
     */
    static start(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }
        const id = player.id;
        if (!fuelInfo[id]) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_TRY_AGAIN);
            return;
        }
        const data = fuelInfo[id];
        if (data.vehicle.isRefueling) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_REFILLING);
            delete fuelInfo[id];
            return;
        }
        if (data.vehicle.engineOn) {
            triallife.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_TURN_OFF_ENGINE);
            return;
        }
        if (!triallife.player.currency.sub(player, data.cost)) {
            triallife.player.emit.notification(player, `${LOCALE_FUEL_STATIONS.FUEL_CANNOT_AFFORD} ${data.cost} $`);
            delete fuelInfo[id];
            return;
        }
        data.vehicle.isRefueling = true;
        triallife.player.emit.createProgressBar(player, {
            uid: `FUEL-${player.data._id}`,
            color: new alt.RGBA(255, 255, 255, 255),
            distance: 15,
            milliseconds: 10000,
            position: data.vehicle.pos,
            text: LOCALE_FUEL_STATIONS.FUELING_PROGRESS_BAR,
        });
        alt.setTimeout(() => {
            if (player) {
                triallife.player.emit.removeProgressBar(player, `FUEL-${player.data._id}`);
                triallife.player.emit.notification(player, `${LOCALE_FUEL_STATIONS.FUEL_COST}${data.cost.toFixed(2).replace('.', ',')} $ | ${data.fuel.toFixed(2)} L`);
            }
            if (data.vehicle && data.vehicle.valid) {
                data.vehicle.isRefueling = false;
                data.vehicle.data.fuel += data.fuel;
                triallife.vehicle.funcs.save(data.vehicle, { fuel: data.vehicle.data.fuel });
            }
            delete fuelInfo[id];
        }, 10000);
    }

    /**
     * `cancel` is a function that takes a player as an argument and deletes the fuelInfo object for that player.
     * @param {alt.Player} player - alt.Player - The player that is using the command.
     * @returns None
     */
    static cancel(player: alt.Player) {
        if (fuelInfo[player.id]) {
            delete fuelInfo[player.id];
        }
    }
}
