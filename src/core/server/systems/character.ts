import * as alt from 'alt-server';
import { triallife } from '../api/triallife';
import { DEFAULT_CONFIG } from '../triallife/main';
import { PlayerEvents } from '../events/playerEvents';
import { TRIALLIFE_EVENTS_PLAYER } from '../../shared/enums/triallife-events';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Character, CharacterDefaults } from '../../shared/interfaces/character';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { World } from './world';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { Global } from './global';
import { CharacterCreateCallback, PlayerCallback, PlayerInjectionNames } from './injections/player';
import { Injections } from './injections';
import { Appearance } from '../../shared/interfaces/appearance';
import { CharacterInfo } from '../../shared/interfaces/characterInfo';
import { ObjectId } from 'mongodb';

const Callbacks: { [key: string]: (player: alt.Player, ...args: any[]) => void } = {
    creator: null,
};

const CharacterSystemRef = {
    setCreatorCallback(callback: (player: alt.Player, ...args: any[]) => void) {
        Callbacks.creator = callback;
    },

    invokeCreator(player: alt.Player, ...args: any[]) {
        if (!Callbacks.creator) {
            alt.logWarning(`No Character Creator Setup in CharacterSystem. Use CharacterSystem.setCreatorCallback`);
            return;
        }

        Callbacks.creator(player, ...args);
    },

    async create(player: alt.Player, appearance: Appearance, info: CharacterInfo, name: string): Promise<boolean> {
        if (!player.accountData || !player.accountData._id) {
            return false;
        }

        const newDocument: Character = deepCloneObject<Character>(CharacterDefaults);
        newDocument.account_id = player.accountData._id.toString();
        newDocument.appearance = appearance;
        newDocument.info = info;
        newDocument.name = name;

        let document = await triallife.database.funcs.insertData<Character>(newDocument, triallife.database.collections.Characters, true);

        if (!document) {
            return false;
        }

        const afterInjections = Injections.get<CharacterCreateCallback>(PlayerInjectionNames.AFTER_CHARACTER_CREATE);
        for (const callback of afterInjections) {
            const appendedDocumentOrVoid = await callback(player, document);
            if (appendedDocumentOrVoid) {
                document = appendedDocumentOrVoid;
            }
        }

        document._id = document._id.toString(); // Re-cast id object as string.
        CharacterSystem.select(player, document);
        return true;
    },

    async select(player: alt.Player, character: Character) {
        if (!player || !player.valid) {
            return;
        }

        player.data = deepCloneObject(character);

        // Increase the value outright
        if (player.data.character_id === undefined || player.data.character_id === null) {
            await Global.increase('nextCharacterId', 1, 1);
            const nextCharacterID = await Global.getKey<number>('nextCharacterId');
            await triallife.state.set(player, 'character_id', nextCharacterID);
        }
        alt.log(`~lb~3L:RP ==>~lg~Charakterauswahl | ${player.data.name} Charakter ID: ${player.data.character_id} | Benutzerkonto: ${player.data.account_id}`);

        const beforeInjections = Injections.get<PlayerCallback>(PlayerInjectionNames.BEFORE_CHARACTER_SELECT);
        for (const callback of beforeInjections) {
            await callback(player);
        }

        triallife.player.sync.appearance(player, player.data.appearance as Appearance);

        if (!player.data.equipment) {
            await triallife.state.set(player, 'equipment', []);
        }

        alt.emitClient(player, SYSTEM_EVENTS.TICKS_START);

        // Set player dimension to zero.
        triallife.player.safe.setDimension(player, 0);
        triallife.player.set.frozen(player, true);

        if (player.data.dimension) {
            triallife.player.safe.setDimension(player, player.data.dimension);
            triallife.player.emit.notification(player, `Dimension: ${player.data.dimension}`);
        }

        alt.setTimeout(async () => {
            if (!player || !player.valid) return;

            if (player.data.pos) triallife.player.safe.setPosition(player, player.data.pos.x, player.data.pos.y, player.data.pos.z);
            else triallife.player.safe.setPosition(player, DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.x, DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.y, DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.z);

            // Check if health exists.
            if (player.data.health) triallife.player.safe.addHealth(player, player.data.health, true);
            else triallife.player.safe.addHealth(player, 200, true);

            // Check if armour exists.
            if (player.data.armour) triallife.player.safe.addArmour(player, player.data.armour, true);
            else triallife.player.safe.addArmour(player, 0, true);

            // Synchronization
            await triallife.player.sync.currencyData(player);
            triallife.player.sync.weather(player);
            triallife.player.sync.time(player);
            triallife.player.sync.inventory(player);

            player.setSyncedMeta(PLAYER_SYNCED_META.NAME, player.data.name);
            player.setSyncedMeta(PLAYER_SYNCED_META.PING, player.ping);
            player.setSyncedMeta(PLAYER_SYNCED_META.POSITION, player.pos);
            player.setSyncedMeta(PLAYER_SYNCED_META.DATABASE_ID, player.data._id.toString());

            // Propagation
            triallife.controllers.blip.populateGlobalBlips(player);
            triallife.controllers.holograms.populateHolograms(player);

            // Vehicle Spawning
            if (!DEFAULT_CONFIG.SPAWN_ALL_VEHICLES_ON_START && DEFAULT_CONFIG.SPAWN_VEHICLES_ON_JOIN) {
                const vehicles = await triallife.vehicle.funcs.getPlayerVehicles(player.data._id);
                triallife.vehicle.funcs.spawnPlayerVehicles(vehicles);
            }

            // Finish Selection
            triallife.player.set.frozen(player, false);
            player.visible = true;
            player.hasFullySpawned = true;

            const afterInjections = Injections.get<PlayerCallback>(PlayerInjectionNames.AFTER_CHARACTER_SELECT);
            for (const callback of afterInjections) {
                await callback(player);
            }

            PlayerEvents.trigger(TRIALLIFE_EVENTS_PLAYER.SELECTED_CHARACTER, player);
        }, 500);
    },

    /**
     * Check if a character name is taken.
     *
     * @static
     * @param {string} name
     * @return {Promise<boolean>}
     * @memberof CharacterSystem
     */
    async isNameTaken(name: string): Promise<boolean> {
        const result = await triallife.database.funcs.fetchData<Character>('name', name, triallife.database.collections.Characters);

        return result ? true : false;
    },

    /**
     * Get all characters that belong to an account.
     *
     * @param {string} account_id player.accountData._id.toString()
     * @return {Promise<Array<Character>>}
     */
    async getCharacters(account_id: string): Promise<Array<Character>> {
        const firstLookup = await triallife.database.funcs.fetchAllByField<Character>('account_id', account_id, triallife.database.collections.Characters);

        const secondLookup = await triallife.database.funcs.fetchAllByField<Character>('account_id', new ObjectId(account_id), triallife.database.collections.Characters);

        if (firstLookup.length >= 1) {
            for (let i = 0; i < firstLookup.length; i++) {
                firstLookup[i]._id = firstLookup[i]._id.toString();
            }
        }

        // This converts all legacy ObjectID `account_id` into strings.
        if (secondLookup.length >= 1) {
            for (let i = 0; i < secondLookup.length; i++) {
                secondLookup[i]._id = secondLookup[i]._id.toString();
                secondLookup[i].account_id = secondLookup[i].account_id.toString();
                await triallife.database.funcs.updatePartialData(secondLookup[i]._id, { account_id: secondLookup[i].account_id }, triallife.database.collections.Characters);
            }
        }

        return [...firstLookup, ...secondLookup];
    },
};

/**
 * It takes a function name and a callback, and if the function exists in the exports object, it
 * overrides it with the callback
 *
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - typeof CharacterSystemRef[Key]
 * @returns The function is being returned.
 */
function override<Key extends keyof typeof CharacterSystemRef>(functionName: Key, callback: typeof CharacterSystemRef[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`systems/character.ts does not provide an export named ${functionName}`);
        return;
    }

    exports[functionName] = callback;
}

export const CharacterSystem: typeof CharacterSystemRef & { override?: typeof override } = {
    ...CharacterSystemRef,
    override,
};
