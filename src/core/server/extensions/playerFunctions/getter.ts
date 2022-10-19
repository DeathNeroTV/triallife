import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { IVehicle } from '../../../shared/interfaces/iVehicle';
import { Collections } from '../../interface/iDatabaseCollections';
import { Character } from '../../../shared/interfaces/character';
import VehicleFuncs from '../vehicleFuncs';
import { PERMISSIONS } from '../../../shared/flags/permissionFlags';
import { distance } from '../../../shared/utility/vector';

const Getter = {
    async allVehicles(player: alt.Player, excludeKeys = false): Promise<IVehicle[]> {
        let vehicles = await Database.fetchAllByField<IVehicle>(`owner`, player.data._id.toString(), Collections.Vehicles);

        if (!excludeKeys) {
            const keys = VehicleFuncs.getAllVehicleKeys(player);
            if (keys.length >= 1) {
                const keyedVehicles = await VehicleFuncs.getValidVehicleIDsFromKeys(keys);
                vehicles = vehicles.concat(keyedVehicles);
            }
        }

        return vehicles;
    },

    async allCharacters(player: alt.Player): Promise<Array<Character>> {
        if (typeof player.accountData === 'undefined') {
            return [];
        }
        return await Database.fetchAllByField('account_id', player.accountData._id, Collections.Characters);
    },

    playersByPermissionLevel(permissionLevels: Array<PERMISSIONS>): Array<alt.Player> {
        const validPlayers = [...alt.Player.all].filter((p) => {
            if (!p || !p.valid || !p.data || typeof p.accountData === 'undefined' || typeof p.accountData.permissionLevel === 'undefined') {
                return false;
            }

            return permissionLevels.includes(p.accountData.permissionLevel);
        });

        return validPlayers;
    },

    playersByGridSpace(player: alt.Player, maxDistance: number): Array<alt.Player> {
        const currentPlayers = [...alt.Player.all];
        return currentPlayers.filter((p) => p && p.valid && p.data && player.gridSpace === p.gridSpace && distance(player.pos, p.pos) < maxDistance);
    },

    closestPlayer(player: alt.Player): alt.Player {
        const players = [...alt.Player.all];
        let targetPlayer = players[0] !== player ? players[0] : players[1];
        let dist = distance(player.pos, targetPlayer.pos);

        for (let i = 0; i < players.length; i++) {
            const newDistance = distance(player.pos, players[i].pos);
            if (!players[i] || !players[i].data) {
                continue;
            }

            if (players[i] === player) {
                continue;
            }

            // This line is going to assist with finding a player in the same grid space.
            if (players[i].gridSpace !== player.gridSpace) {
                continue;
            }

            if (dist > newDistance) {
                continue;
            }

            dist = newDistance;
            targetPlayer = players[i];
        }

        return targetPlayer;
    },
};

function override<Key extends keyof typeof Getter>(functionName: Key, callback: typeof Getter[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`triallife.player.get does not provide an export named ${functionName}`);
    }

    exports[functionName] = callback;
}

const exports: typeof Getter & { override?: typeof override } = {
    ...Getter,
    override,
};

export default exports;
