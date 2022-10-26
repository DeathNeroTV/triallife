import * as alt from 'alt-server';
import EFFECTS from '../../shared/enums/effects';
import { INVENTORY_TYPE } from '../../shared/enums/inventoryTypes';

import { ANIMATION_FLAGS } from '../../shared/flags/animationFlags';
import { Item } from '../../shared/interfaces/item';
import { Task, TaskCallback } from '../../shared/interfaces/taskTimeline';
import { triallife } from '../api/triallife';
import VehicleFuncs from '../extensions/vehicleFuncs';
import { ItemEffects } from '../systems/itemEffects';
import { getForwardVector } from '../utility/vector';

const isUsingTimeline: Array<{ player: alt.Player; vehicle: alt.Vehicle }> = [];

alt.onClient('task:Vehicle:Repair:Timeline', handleRepairTimeline);

function handleRepair(player: alt.Player, item: Item, slot: number, type: INVENTORY_TYPE | string) {
    const closestVehicle = triallife.player.utility.getVehicleInFrontOf(player, 2);
    if (!closestVehicle) {
        triallife.player.emit.notification(player, `Kein Fahrzeug in der Nähe für eine Reperatur.`);
        return;
    }
    if (player.vehicle) {
        triallife.player.emit.notification(player, `Sie müssen erstmal aus dem Fahrzeug aussteigen.`);
        return;
    }
    const removedKit = triallife.player.inventory.findAndRemove(player, 'Werkzeugkasten');
    if (!removedKit) {
        triallife.player.emit.notification(player, `Sie haben kein Werkzeugkasten dabei.`);
        return;
    }
    const fwdVector = getForwardVector(closestVehicle.rot);
    const fwdPosition = {
        x: closestVehicle.pos.x + fwdVector.x * 2,
        y: closestVehicle.pos.y + fwdVector.y * 2,
        z: closestVehicle.pos.z,
    };
    const timeline: Array<Task | TaskCallback> = [
        {
            // taskGoToCoordAnyMeans(ped: number, x: number, y: number, z: number, speed: number, p5: any, p6: boolean, walkingStyle: number, p8: number
            nativeName: 'taskGoToCoordAnyMeans',
            params: [fwdPosition.x, fwdPosition.y, fwdPosition.z, 1, 0, false, 786603, 0],
            timeToWaitInMs: 5000,
        },
        {
            // taskTurnPedToFaceCoord(ped: number, x: number, y: number, z: number, duration: number)
            nativeName: 'taskTurnPedToFaceCoord',
            params: [closestVehicle.pos.x, closestVehicle.pos.y, closestVehicle.pos.z, 2000],
            timeToWaitInMs: 2000,
        },
        {
            callbackName: 'task:Vehicle:Repair:Timeline',
        },
    ];

    isUsingTimeline.push({ player, vehicle: closestVehicle });
    triallife.player.emit.taskTimeline(player, timeline);
}

function handleRepairTimeline(player: alt.Player) {
    const index = isUsingTimeline.findIndex((data) => data.player === player);
    if (index <= -1) {
        return;
    }

    const closestVehicle = isUsingTimeline[index].vehicle;
    isUsingTimeline.splice(index, 1);

    if (!closestVehicle || !closestVehicle.valid) {
        return;
    }

    triallife.player.emit.animation(player, 'mp_car_bomb', 'car_bomb_mechanic', ANIMATION_FLAGS.NORMAL | ANIMATION_FLAGS.REPEAT, 12000);

    alt.setTimeout(() => {
        VehicleFuncs.repair(closestVehicle);
    }, 12000);
}

ItemEffects.add(EFFECTS.EFFECT_REPAIR, handleRepair);
