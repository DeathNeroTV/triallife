import * as alt from 'alt-client';
import * as native from 'natives';
import { distance } from '../../shared/utility/vector';
import { PushVehicle } from '../systems/push';
import { isAnyMenuOpen } from '../utility/menus';
import { VEHICLE_EVENTS } from '../../shared/enums/vehicle';
import { IWheelOptionExt } from '../../shared/interfaces/wheelMenu';
import { WheelMenu } from '../views/wheelMenu';

type VehicleMenuInjection = (target: alt.Vehicle, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;

// Push vehicle
const BLACKLISTED_VEHICLE_TYPES = [
    10, // Industrial
    13, // Cycles
    14, // Boats
    15, // Helicopters
    16, // Planes
    20, // Commercial
    21, // Trains
];

const DoorNames = {
    0: 'Fahrertür',
    1: 'Beifahrertür',
    2: 'Beifahrertür hinten links',
    3: 'Beifahrertür hinten rechts',
    4: 'Motorhaube',
    5: 'Kofferraum',
}

const Injections: Array<VehicleMenuInjection> = [];

export class VehicleWheelMenu {
    /**
     * Create a vehicle wheel menu injection.
     * Meaning, a callback that will modify existing options, or append new options to the menu.
     * Must always return the original wheel menu options + your changes.
     *
     * @static
     * @param {VehicleMenuInjection} callback
     * @memberof VehicleMenu
     */
    static addInjection(callback: VehicleMenuInjection) {
        Injections.push(callback);
    }

    /**
     * Open an in-vehicle menu option and add injections relevant to in-vehicle.
     *
     * @static
     * @param {alt.Vehicle} vehicle
     * @return {*}
     * @memberof VehicleWheelMenu
     */
    static openInVehicleMenu(vehicle: alt.Vehicle) {
        if (isAnyMenuOpen()) {
            return;
        }

        if (!vehicle || !vehicle.valid) {
            return;
        }

        let options: Array<IWheelOptionExt> = [];

        const pedInDriverSeat = native.getPedInVehicleSeat(vehicle.scriptID, -1, false);

        // Is Driver Function
        if (pedInDriverSeat === alt.Player.local.scriptID) {
            const engineOn = native.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID);
            options.push({
                name: engineOn ? 'Einschalten' : 'Abschalten',
                icon: 'icon-engine-fill',
                color: engineOn ? 'red' : 'green',
                emitServer: VEHICLE_EVENTS.SET_ENGINE,
            });
        }

        for (const callback of Injections) {
            try {
                options = callback(vehicle, options);
            } catch (err) {
                console.warn(`Got Vehicle Menu Injection Error ${err}`);
                continue;
            }
        }

        if (options.length <= 0) {
            return;
        }

        WheelMenu.open('Fahrzeug', options);
    }

    static openMenu(vehicle: alt.Vehicle) {
        if (isAnyMenuOpen()) return;
        if (!vehicle || !vehicle.valid) return;
        const dist = distance(alt.Player.local.pos, vehicle.pos);
        if (dist >= 4) return;
        let options: Array<IWheelOptionExt> = [];
        const isDestroyed = native.getVehicleEngineHealth(vehicle.scriptID) <= 0;
        const isLocked = native.getVehicleDoorLockStatus(vehicle.scriptID) === 2;
        options.push({
            name: isLocked ? 'Aufschließen' : 'Abschließen',
            color: isLocked ? 'green' : 'red',
            icon: isLocked ? 'icon-lock-open' : 'icon-lock',
            emitServer: VEHICLE_EVENTS.SET_LOCK,
        });
        const type = native.getVehicleClass(vehicle);
        // Not Pushing & Vehicle is Currently Unlocked
        if (!PushVehicle.isPushing() && !isLocked && !isDestroyed) {
            if (!BLACKLISTED_VEHICLE_TYPES.includes(type)) {
                options.push({
                    name: 'Schieben',
                    icon: 'icon-push',
                    color: 'green',
                    callback: PushVehicle.start,
                    data: [vehicle],
                });
            }
            options.push({
                name: 'Kofferraum öffnen',
                icon: 'icon-box',
                callback: () => {
                    alt.emitServer(VEHICLE_EVENTS.OPEN_STORAGE, vehicle);
                    if (native.getVehicleDoorAngleRatio(vehicle.scriptID, 5) < 0.9) alt.emitServer(VEHICLE_EVENTS.SET_DOOR, 5);
                },
            });
            const numberOfDooors = native.getNumberOfVehicleDoors(vehicle.scriptID);
            const newOptions: Array<IWheelOptionExt> = [];        
            for (let i = 0; i < numberOfDooors; i++) {
                const isOpen = native.getVehicleDoorAngleRatio(vehicle.scriptID, i) >= 0.9;
                newOptions.push({
                    name: isOpen ? `${DoorNames[i]} schließen` : `${DoorNames[i]} öffnen`,
                    color: isOpen ? 'green' : 'red',
                    icon: 'icon-sensor_door',
                    emitServer: VEHICLE_EVENTS.SET_DOOR,
                    data: [i]
                });
            }
            options.push({
                name: 'Fahrzeugtüren',
                icon: 'icon-sensor_door',
                doNotClose: true,
                callback: () => WheelMenu.update('Fahrzeugtüren', newOptions, true),
            });
        } else if (PushVehicle.isPushing()) {
            options.push({
                name: 'Aufhören',
                color: 'red',
                icon: 'icon-push',
                callback: PushVehicle.clear,
            });
        }

        for (const callback of Injections) {
            try {
                options = callback(vehicle, options);
            } catch (err) {
                console.warn(`Got Vehicle Menu Injection Error ${err}`);
                continue;
            }
        }

        if (options.length <= 0) {
            return;
        }

        WheelMenu.open('Fahrzeug', options);
    }
}
