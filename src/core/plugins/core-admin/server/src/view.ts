import * as alt from 'alt-server';

import Database from '@stuyk/ezmongodb';
import { ADMIN_INTERACTIONS } from '../../shared/events';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { triallife } from '../../../../server/api/triallife';
import { Account } from '../../../../server/interface/iAccount';
import { BankInfo } from '../../../../shared/interfaces/bank';
import { Character } from '../../../../shared/interfaces/character';
import { Faction } from '../../../core-factions/shared/interfaces';
import { Item } from '../../../../shared/interfaces/inventory';
import { Interior } from '../../../core-interior/shared/interfaces';
import { VehicleInfo } from '../../../../shared/interfaces/vehicleInfo';
import { FactionHandler } from '../../../core-factions/server/src/handler';
import { FactionFuncs } from '../../../core-factions/server/src/funcs';

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
        triallife.player.emit.meta(player, 'admin', data);
    }

    static async disconnect(player: alt.Player, reason: string) {}

    static async modify(player: alt.Player, collections: string, data: string) {
        if (collections === 'factions') {
            var concernData = JSON.parse(data);
            var concern = FactionHandler.find(concernData.name);
            if (concern) {
                const result = await FactionHandler.update(concern._id.toString(), concernData);
                if (!result.status) {
                    triallife.player.emit.notification(player, result.response);
                    return;
                }
                concern = FactionHandler.get(concern._id.toString());
                FactionHandler.updateSettings(concern);
                triallife.player.emit.notification(player, result.response);
            } else {
                const result = await FactionHandler.add(player.data._id.toString(), {
                    bank: 0,
                    canDisband: true,
                    name: concernData.name,
                    type: concernData.type,
                });
                if (!result.status) {
                    triallife.player.emit.notification(player, result.response);
                    return;
                }
                triallife.player.emit.notification(player, 'Die Firma wurde erstellt');
            }
        }
        InternalFunctions.load(player);
    }

    static async remove(player: alt.Player, collections: string, _id: string) {
        if (collections === 'factions') {
            const result = await FactionHandler.remove(_id);
            triallife.player.emit.notification(player, result.response);
        }
        InternalFunctions.load(player);
    }

    static async ban(player: alt.Player, charID: number, state: boolean, reason: string) {
        const target = alt.Player.all.find((x) => x.data && x.data.character_id === charID);
        if (!target) {
            const hasUpdated = await Database.updateDataByFieldMatch('character_id', charID, { banned: { state, reason } }, Collections.Characters);
            triallife.player.emit.soundFrontend(player, hasUpdated ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            if (hasUpdated) triallife.player.emit.notification(player, `Der Charakter wurde erfolgreich ${state ? 'gebannt' : 'entbannt'}.`);
            InternalFunctions.load(player);
            return;
        }
        triallife.state.set(target, 'banned', { state, reason }, true);
        triallife.player.emit.soundFrontend(player, state ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        InternalFunctions.load(player);
        if (state) target.kick(`Sie wurden gebannt. Grund: ${reason}`);
    }
}

export class AdminFunctions {
    static init() {}
}

alt.onClient(ADMIN_INTERACTIONS.BAN, InternalFunctions.ban);
alt.onClient(ADMIN_INTERACTIONS.LOAD, InternalFunctions.load);
alt.onClient(ADMIN_INTERACTIONS.OPEN, InternalFunctions.show);
alt.onClient(ADMIN_INTERACTIONS.MODIFY, InternalFunctions.modify);
alt.onClient(ADMIN_INTERACTIONS.REMOVE, InternalFunctions.remove);
