import * as alt from 'alt-server';
import { triallife } from '../../../../server/api/triallife';
import { VehicleEvents } from '../../../../server/events/vehicleEvents';
import { TRIALLIFE_EVENTS_VEHICLE } from '../../../../shared/enums/triallife-events';

export class GarageSystem {
    static init() {
        VehicleEvents.on(TRIALLIFE_EVENTS_VEHICLE.DESTROYED, GarageSystem.handleDestroy);
    }

    static handleDestroy(vehicle: alt.Vehicle) {
        if (!vehicle || !vehicle.data) {
            return;
        }

        triallife.vehicle.funcs.save(vehicle, { garageIndex: null, position: { x: 0, y: 0, z: 0 } });
    }
}
