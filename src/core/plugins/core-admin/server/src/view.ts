import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { ADMIN_INTERACTIONS } from '../../shared/events';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { triallife } from '../../../../server/api/triallife';
import { Account } from '../../../../server/interface/iAccount';
import { BankInfo } from '../../../../shared/interfaces/bank';
import { Character } from '../../../../shared/interfaces/character';
import { Faction, FactionCharacter } from '../../../core-factions/shared/interfaces';
import { Item } from '../../../../shared/interfaces/inventory';
import { Interior } from '../../../core-interior/shared/interfaces';
import { VehicleInfo } from '../../../../shared/interfaces/vehicleInfo';
import { FactionHandler } from '../../../core-factions/server/src/handler';
import { deepCloneObject } from '../../../../shared/utility/deepCopy';
import { IVehicle } from '../../../../shared/interfaces/iVehicle';
import { FactionFuncs } from '../../../core-factions/server/src/funcs';
import { Vehicle_Behavior } from '../../../../shared/enums/vehicle';
import { InteriorSystem } from '../../../core-interior/server/src/system';
import { StateManager } from '../../../../server/systems/stateManager';

class InternalFunctions {
    static show(player: alt.Player) {
        alt.emitClient(player, ADMIN_INTERACTIONS.OPEN);
    }

    static async load(player: alt.Player) {
        var data = {};
        data['accounts'] = await Database.fetchAllData<Account>(Collections.Accounts);
        data['banks'] = await Database.fetchAllData<BankInfo>(Collections.Banks);
        data['characters'] = await Database.fetchAllData<Character>(Collections.Characters);
        data['factions'] = FactionHandler.getAllFactions();
        data['storage'] = await Database.fetchAllData<Storage>(Collections.Storage);
        data['stores'] = await Database.fetchAllData<Storage>(Collections.Stores);
        data['items'] = await Database.fetchAllData<Item>(Collections.Items);
        data['interiors'] = await Database.fetchAllData<Interior>(Collections.Interiors);
        data['vehicles'] = await Database.fetchAllData<VehicleInfo>(Collections.Vehicles);
        for (const key of Object.keys(data)) {
            for (var i = 0; i < data[key].length; i++) {
                if (data[key][i] && data[key][i]._id && typeof data[key][i]._id !== 'string') {
                    data[key][i]._id = data[key][i]._id.toString();
                }
            }
        }
        triallife.player.emit.meta(player, 'admin', data);
    }

    static async disconnect(player: alt.Player, reason: string) {}

    static async modify(player: alt.Player, collections: string, _id: string, data: string) {
        if (collections === 'banks') {
            const partialObject = JSON.parse(data) as Partial<BankInfo>;
            if (partialObject._id) delete partialObject._id;
            await triallife.database.funcs.updatePartialData(_id, partialObject, triallife.database.collections.Banks);
            const target = [...alt.Player.all].filter(x => x.data).find(x => x.data._id.toString() === partialObject.owner);
            if (target) {
                const banks = triallife.player.currency.getAllBankAccountsPlayer(target);
                StateManager.set(target, 'banks', banks);
                triallife.player.emit.meta(target, 'banks', banks);
                triallife.player.emit.soundFrontend(target, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                triallife.player.emit.notification(player, 'Ihr Bankkonto wurde aktualisiert');
            }
            const status = await Database.updatePartialData(_id, partialObject, Collections.Characters);
            triallife.player.emit.soundFrontend(player, status ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            triallife.player.emit.notification(player, status ? 'Charakter wurde bearbeitet' : 'Charakter wurde nicht bearbeitet');
        } else if (collections === 'characters') {
            const partialObject = JSON.parse(data) as Partial<Character>;
            if (partialObject._id) delete partialObject._id;
            const allPlayers = [...alt.Player.all].filter(x => x.data);
            const target = allPlayers.find(x => x.data._id === _id);
            if (target) {
                const wasDead = target.data.isDead;
                for (const key of Object.keys(target.data)) {
                    if (!partialObject[key]) return;
                    target.data[key] = partialObject[key];
                    if (key !== 'isDead') {
                        const isSet = await triallife.state.set(target, key, partialObject[key]);
                        if (isSet) triallife.player.emit.meta(target, key, partialObject[key]);
                    }
                }
                if (wasDead && !target.data.isDead) {
                    triallife.player.emit.meta(target, 'isDead', false);
                    await triallife.state.set(target, 'isDead', false);
                    triallife.player.set.respawned(target, target.pos);
                } else if (!wasDead && target.data.isDead) {                    
                    await triallife.state.set(target, 'isDead', true);
                    triallife.player.emit.meta(target, 'isDead', true);
                }
            }
            const status = await Database.updatePartialData(_id, partialObject, Collections.Characters);
            triallife.player.emit.soundFrontend(player, status ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            triallife.player.emit.notification(player, status ? 'Charakter wurde bearbeitet' : 'Charakter wurde nicht bearbeitet');
        } else if (collections === 'factions') {
            const partialObject = JSON.parse(data) as Partial<Faction>;
            if (partialObject._id) delete partialObject._id;
            if (FactionHandler.get(_id)) {
                const result = await FactionHandler.update(_id, partialObject);
                if (!result.status) {
                    triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                    triallife.player.emit.notification(player, result.response);
                    return;
                }
                const concern = FactionHandler.get(_id);
                FactionHandler.updateSettings(concern);
                triallife.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                triallife.player.emit.notification(player, result.response);
            } else {
                const result = await FactionHandler.add(player.data._id, {
                    bank: 0,
                    canDisband: true,
                    name: partialObject.name,
                    type: partialObject.type,
                });
                if (!result.status) {
                    triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                    triallife.player.emit.notification(player, result.response);
                    return;
                }
                triallife.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                triallife.player.emit.notification(player, 'Die Firma wurde erstellt');
            }
        }
        await InternalFunctions.load(player);
    }

    static async remove(player: alt.Player, collections: string, _id: string) {        
        if (collections === 'banks') {
            const bank = await triallife.database.funcs.fetchData<BankInfo>('_id', _id, triallife.database.collections.Banks);
            if (!bank) return;
            const character = await triallife.database.funcs.fetchData<Character>('_id', bank.owner, triallife.database.collections.Characters);
            const faction = await triallife.database.funcs.fetchData<Faction>('_id', bank.owner, triallife.database.collections.Factions);
            if (character) await triallife.database.funcs.updatePartialData(character._id, { cash: character.cash + bank.amount }, triallife.database.collections.Characters);
            if (faction) await triallife.database.funcs.updatePartialData(faction._id, { bank: faction.bank + bank.amount }, triallife.database.collections.Factions);
            const deleted = await triallife.database.funcs.deleteById(_id, triallife.database.collections.Banks);
            triallife.player.emit.notification(player, deleted ? 'Das Bankkonto wurde erfolgreich gelöscht' : 'Das Bankkonto wurde nicht gelöscht');
            triallife.player.emit.soundFrontend(player, deleted ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        } else if (collections === 'characters') {
            const character = await triallife.database.funcs.fetchData<Character>('_id', _id, triallife.database.collections.Characters);
            const vehicles = await triallife.database.funcs.fetchAllByField<IVehicle>('owner', _id, triallife.database.collections.Vehicles);
            const banks = await triallife.database.funcs.fetchAllByField<BankInfo>('owner', _id, triallife.database.collections.Banks);
            const faction = await triallife.database.funcs.fetchData<Faction>('_id', character.faction, triallife.database.collections.Factions);
            const interiors = await triallife.database.funcs.fetchAllByField<Interior>('owner', _id, triallife.database.collections.Interiors);
            const spawnedVehicles = [...alt.Vehicle.all]; 
            for(const vehicle of vehicles) {
                const spawnedVehicle = spawnedVehicles.find(x => x.data._id.toString() === vehicle._id.toString());
                if (spawnedVehicle) {
                    await triallife.vehicle.funcs.save(spawnedVehicle, { owner: null, behavior: Vehicle_Behavior.NO_KEY_TO_START | Vehicle_Behavior.NO_KEY_TO_LOCK });
                    triallife.vehicle.funcs.despawn(vehicle.id);
                }
            }
            for(const bank of banks) {
                await triallife.database.funcs.updatePartialData(bank._id, { owner: null }, triallife.database.collections.Banks);
            }
            for(const interior of interiors) {
                InteriorSystem.removeOwnership(interior.uid);
            }
            if (faction) FactionFuncs.kickMember(faction, _id);
            const target = [...alt.Player.all].find(x => x.data && x.data._id.toString() === character._id.toString());
            if (target) target.kick('Ihr Charakter wurde gelöscht. Bitte bei dem Support meldet.');
            const deleted = await triallife.database.funcs.deleteById(_id, triallife.database.collections.Characters);
            triallife.player.emit.notification(player, deleted ? 'Der Charakter wurde erfolgreich gelöscht' : 'Der Charakter wurde nicht gelöscht');
            triallife.player.emit.soundFrontend(player, deleted ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        } else if (collections === 'factions') {
            const result = await FactionHandler.remove(_id);
            triallife.player.emit.notification(player, result.response);
            triallife.player.emit.soundFrontend(player, result.status ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        }
        await InternalFunctions.load(player);
    }

    static async ban(player: alt.Player, charID: number, state: boolean, reason: string) {
        const target = alt.Player.all.find((x) => x.data && x.data.character_id === charID);
        if (target) {
            triallife.state.set(target, 'banned', { state, reason });
            if (state) target.kick(`Sie wurden gebannt. Grund: ${reason}`);
        }
        const hasUpdated = await Database.updateDataByFieldMatch('character_id', charID, { banned: { state, reason } }, Collections.Characters);
        triallife.player.emit.notification(player, `Der Charakter wurde erfolgreich ${state ? 'gebannt' : 'entbannt'}.`);
        triallife.player.emit.soundFrontend(player, hasUpdated ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        await InternalFunctions.load(player);
    }

    static async addMember(player: alt.Player, factionID: string, memberID: string, rankID: string, hasOwnership: boolean) {
        const concern = deepCloneObject<Faction>(FactionHandler.get(factionID));
        if (!concern) return;
        delete concern._id;
        if (concern.members[memberID]) {
            concern.members[memberID].rank = rankID;
            concern.members[memberID].hasOwnership = hasOwnership;
            const result = await FactionHandler.update(factionID, concern);
            triallife.player.emit.soundFrontend(player, result.status ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            triallife.player.emit.notification(player, result.response);
            return;
        }
        const target = alt.Player.all.find((x) => x.data && x.data._id === memberID);
        if (target) triallife.state.set(target, 'faction', factionID);
        const name = (await Database.fetchData<Character>('_id', memberID, Collections.Characters)).name;
        concern.members[memberID] = { id: memberID, name, rank: rankID, hasOwnership } as FactionCharacter;
        await Database.updatePartialData(memberID, { faction: factionID }, Collections.Characters);
        const result = await FactionHandler.update(factionID, concern);
        triallife.player.emit.soundFrontend(player, result.status ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        triallife.player.emit.notification(player, result.response);
        await InternalFunctions.load(player);
    }

    static async removeMember(player: alt.Player, factionID: string, memberID: string) {
        const concern =  deepCloneObject<Faction>(FactionHandler.get(factionID));
        if (!concern) return;
        delete concern._id;
        if (!concern.members[memberID]) return;
        delete concern.members[memberID];
        const target = alt.Player.all.find((x) => x.data && x.data._id === memberID);
        if (target) triallife.state.set(target, 'faction', null);
        await Database.updatePartialData(memberID, { faction: null }, Collections.Characters);
        const result = await FactionHandler.update(factionID, concern);
        triallife.player.emit.soundFrontend(player, result.status ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        triallife.player.emit.notification(player, result.response);
        await InternalFunctions.load(player);
    }

    static async position(player: alt.Player, factionID: string, keys: any | any[]) {
        const faction = deepCloneObject<Faction>(FactionHandler.get(factionID));
        if (!faction) return;
        delete faction._id;
        const pos = player.vehicle ? player.vehicle.pos : { x: player.pos.x, y: player.pos.y, z: player.pos.z - 0.5 };
        const rot = player.vehicle ? player.vehicle.rot : { x: player.rot.x, y: player.rot.y, z: player.rot.z };
        if (Array.isArray(keys)) {
            if (keys.length === 2) {
                if (InternalFunctions.isPosition(keys[1])) faction[keys[0]][keys[1]] = pos;
                else if (InternalFunctions.isRotation(keys[1])) faction[keys[0]][keys[1]] = rot;
            } else if (keys.length === 3) {
                if (InternalFunctions.isPosition(keys[2])) faction[keys[0]][keys[1]][keys[2]] = pos;
                else if (InternalFunctions.isRotation(keys[2])) faction[keys[0]][keys[1]][keys[2]] = rot;
            } else if (keys.length === 4) {
                if (InternalFunctions.isPosition(keys[3])) faction[keys[0]][keys[1]][keys[2]][keys[3]] = pos;
                else if (InternalFunctions.isRotation(keys[3])) faction[keys[0]][keys[1]][keys[2]][keys[3]] = rot;
            }
        } else {
            if (InternalFunctions.isPosition(keys)) faction[keys] = pos;
            else if (InternalFunctions.isRotation(keys)) faction[keys] = rot;
        }
        const result = await FactionHandler.update(factionID, faction);
        triallife.player.emit.soundFrontend(player, result.status ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        triallife.player.emit.notification(player, result.response);
        await InternalFunctions.load(player);
    }

    private static isPosition(key: string) {
        const vectorList: Array<string> = ['pos', 'position', 'outside', 'inside'];
        return vectorList.findIndex((x) => x === key) !== -1;
    }

    private static isRotation(key: string) {
        const vectorList: Array<string> = ['rot', 'rotation'];
        return vectorList.findIndex((x) => x === key) !== -1;
    }
}

export class AdminFunctions {
    static init() {
        alt.onClient(ADMIN_INTERACTIONS.BAN, InternalFunctions.ban);
        alt.onClient(ADMIN_INTERACTIONS.ADDMEMBER, InternalFunctions.addMember);
        alt.onClient(ADMIN_INTERACTIONS.REMOVEMEMBER, InternalFunctions.removeMember);
        alt.onClient(ADMIN_INTERACTIONS.POSITION, InternalFunctions.position);
        alt.onClient(ADMIN_INTERACTIONS.LOAD, InternalFunctions.load);
        alt.onClient(ADMIN_INTERACTIONS.OPEN, InternalFunctions.show);
        alt.onClient(ADMIN_INTERACTIONS.MODIFY, InternalFunctions.modify);
        alt.onClient(ADMIN_INTERACTIONS.REMOVE, InternalFunctions.remove);
    }
}
