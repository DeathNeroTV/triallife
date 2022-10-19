import * as alt from 'alt-server';
import { triallife_EVENTS_VEHICLE } from '../../shared/enums/triallife-events';

const vehicleEvents: Array<{ eventName: string; callback: (vehicle: alt.Vehicle, ...args: any[]) => void }> = [];

export class VehicleEvents {
    /**
     * Usually called by internal functions. Can be used to manually trigger an triallife Event though.
     * @static
     * @param {triallife_EVENTS_VEHICLE} eventName
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleEvents
     */
    static trigger(eventName: triallife_EVENTS_VEHICLE, vehicle: alt.Vehicle, ...args: any[]) {
        for (let i = 0; i < vehicleEvents.length; i++) {
            if (vehicleEvents[i].eventName !== eventName) {
                continue;
            }

            vehicleEvents[i].callback(vehicle, ...args);
        }
    }

    /**
     * Trigger a callback specific to triallife Vehicle Events.
     * @static
     * @param {triallife_EVENTS_VEHICLE} eventName
     * @param {(player: alt.Player) => void} callback
     * @memberof VehicleEvents
     */
    static on(eventName: triallife_EVENTS_VEHICLE, callback: (vehicle: alt.Vehicle, ...args: any[]) => void) {
        vehicleEvents.push({ eventName, callback });
    }
}
