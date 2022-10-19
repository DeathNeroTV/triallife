import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/character';
import { IVehicle } from '../../shared/interfaces/iVehicle';
import { RemoveIndex } from '../../shared/utility/knownKeys';
import { triallife } from '../api/triallife';

type AnyKeyChangeCallback = (target: alt.Player | alt.Vehicle | { data: Partial<Character> }, key: string, oldValue: any, newValue: any) => void;
type KeyChangeCallback<T = alt.Player | alt.Vehicle> = (target: T, oldValue: any, newValue: any) => void;

interface StateTypes {
    playerData: { [key: string]: Array<KeyChangeCallback<alt.Player>> };
    vehicleData: { [key: string]: Array<KeyChangeCallback<alt.Vehicle>> };
}

const data: StateTypes = {
    playerData: {},
    vehicleData: {},
};

const anyChangeCallbacks: Array<AnyKeyChangeCallback> = [];

export class StateManager {
    private static processCallbacks(target: alt.Player | alt.Vehicle | { data: Partial<Character> }, key: string, oldValue: any, newValue: any) {
        const dataType = target instanceof alt.Player ? 'playerData' : 'vehicleData';

        // Check if data type has any callbacks for the specific key provided
        if (data[dataType][key] && Array.isArray(data[dataType][key]) && data[dataType][key].length >= 1) {
            if (target instanceof alt.Player) {
                for (const callback of data.playerData[key]) {
                    callback(target, oldValue, newValue);
                }
            }

            if (target instanceof alt.Vehicle) {
                for (const callback of data.vehicleData[key]) {
                    callback(target, oldValue, newValue);
                }
            }
        }

        // Process any type changes that have occured and are subscribed to.
        if (anyChangeCallbacks.length >= 1) {
            for (const callback of anyChangeCallbacks) {
                callback(target, key, oldValue, newValue);
            }
        }

        target.data[key] = newValue;
    }

    static async setBulk(target: alt.Player | alt.Vehicle, newData: Partial<Character | IVehicle>, forceSave = false): Promise<boolean> {
        if (!target.valid || !target.data || !target.data._id) {
            return false;
        }

        let dataToUpdate: Partial<Character | IVehicle> = {};

        for (const key of Object.keys(newData)) {
            const oldData = target.data[key];
            StateManager.processCallbacks(target, key, oldData, newData[key]);

            if (forceSave) {
                dataToUpdate[key] = newData[key];
                continue;
            }

            const compareDiff = typeof newData[key] === 'string' || typeof newData[key] === 'number' || typeof newData[key] === 'boolean';

            if (!compareDiff) {
                dataToUpdate[key] = newData[key];
                continue;
            }

            if (newData[key] === oldData) {
                continue;
            }

            dataToUpdate[key] = newData[key];
        }

        if (Object.keys(dataToUpdate).length <= 0) {
            return true;
        }

        const collection = target instanceof alt.Player ? triallife.database.collections.Characters : triallife.database.collections.Vehicles;

        return await triallife.database.funcs.updatePartialData(target.data._id.toString(), dataToUpdate, collection);
    }

    static async set(target: alt.Player, key: keyof RemoveIndex<Character>, value: any, forceSave?: boolean): Promise<boolean>;

    static async set(target: { data: Partial<Character> }, key: keyof RemoveIndex<Character>, value: any, forceSave?: boolean): Promise<boolean>;

    static async set(target: alt.Player, key: string, value: any, forceSave?: boolean): Promise<boolean>;

    static async set(target: alt.Vehicle, key: keyof RemoveIndex<IVehicle>, value: any, forceSave?: boolean): Promise<boolean>;

    static async set(target: alt.Vehicle, key: string, value: any, forceSave?: boolean): Promise<boolean>;

    static async set(target: alt.Player | alt.Vehicle | { data: Partial<Character> }, key: string, newValue: any, forceSave: boolean = false): Promise<boolean> {
        if (target instanceof alt.Player || target instanceof alt.Vehicle) {
            if (!target || !target.data || !target.data._id) {
                return false;
            }
        }

        if (!key) {
            alt.logWarning(`Tried to set data, but key was undefined in State Manager. Value Used: ${newValue}`);
            return false;
        }

        const oldValue = target.data[key];

        StateManager.processCallbacks(target, key, oldValue, newValue);

        const compareDiff = typeof newValue === 'string' || typeof newValue === 'number' || typeof newValue === 'boolean';

        if (compareDiff && newValue === oldValue && !forceSave) {
            return true;
        }

        const collection = target instanceof alt.Player ? triallife.database.collections.Characters : triallife.database.collections.Vehicles;

        return await triallife.database.funcs.updatePartialData(target.data._id.toString(), { [key]: newValue }, collection);
    }

    static get<T>(target: alt.Player | alt.Vehicle, key: string): T | undefined {
        if (!target.data) {
            alt.logWarning(`${target.id} does not have a data property.`);
            return undefined;
        }

        if (key === '_id') {
            return target.data._id.toString();
        }

        return target.data[key];
    }

    static subscribe(callback: AnyKeyChangeCallback) {
        anyChangeCallbacks.push(callback);
    }

    static on(dataType: 'playerData' | 'vehicleData', key: string, callback: KeyChangeCallback) {
        if (!data[dataType]) {
            alt.logWarning(`Could not find Type ${dataType} for State Manager. Must be playerData or vehicleData`);
            return;
        }

        if (!data[dataType][key]) {
            data[dataType][key] = [];
        }

        data[dataType][key].push(callback);
    }
}
