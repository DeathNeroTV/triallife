import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { sha256Random } from '../../../../server/utility/encryption';
import { StorageView } from '../../../../server/views/storage';
import { DefaultRanks, DefaultSettings } from '../../shared/defaultData';
import { Faction, FactionCore, FactionRank, FactionSettings } from '../../shared/interfaces';
import { Character } from '../../../../shared/interfaces/character';
import { IGenericResponse } from '../../../../shared/interfaces/iResponse';
import { deepCloneObject } from '../../../../shared/utility/deepCopy';
import { triallife } from '../../../../server/api/triallife';
import { BankInfo } from '../../../../shared/interfaces/bank';

const factions: { [key: string]: Faction } = {};

class InternalFunctions {
    /**
     * Create the faction and add cache it to memory.
     *
     * @static
     * @param {Faction} faction
     * @memberof InternalFunctions
     */
    static create(faction: Faction) {
        faction._id = faction._id.toString();
        factions[faction._id as string] = faction;
        if (!faction.settings) {
            faction.settings = DefaultSettings;
            alt.log(`~lb~3LRP ==> ~w~Keine Standard Settings in der Firma ~lg~${faction.name} ~w~vorhanden`);
        }
        FactionHandler.updateSettings(faction);
    }
}

export class FactionHandler {
    /**
     * Faction Types.
     * Gang can do crime actions.
     * Neutral is Neutral.
     * State can do state actions ( arrest, cuff people, etc. )
     */
    static factionTypes = {
        gang: 'GANG',
        neutral: 'NEUTRAL',
        state: 'STATE',
    };

    /**
     * Initialize Factions on Startup
     *
     * @static
     * @memberof FactionCore
     */
    static async init() {
        const factions = await Database.fetchAllData<Faction>(Collections.Factions);
        if (factions.length <= 0) return;
        for (let i = 0; i < factions.length; i++) {
            InternalFunctions.create(factions[i]);
        }
    }

    /**
     * Add a faction and return a _id if created successfully added.
     *
     * @static
     * @param {alt.Player} player
     * @param {FactionCore} _faction
     * @return {Promise<IGenericResponse>} _id
     * @memberof FactionHandler
     */
    static async add(characterOwnerID: string, _faction: FactionCore): Promise<IGenericResponse<string>> {
        if (!_faction.name) return { status: false, response: `Firma wurde nicht erstellt, da der Name fehlt.` };
        if (!this.factionTypes[_faction.type]) _faction.type = this.factionTypes.neutral;
        if (_faction.bank === null || _faction.bank === undefined) _faction.bank = 0;
        const character = await Database.fetchData<Character>('_id', characterOwnerID, Collections.Characters);
        if (!character) return { status: false, response: `Could not find a character with identifier: ${characterOwnerID}` };
        if (character.faction) return { status: false, response: `Character is already in a faction.` };
        const defaultRanks = deepCloneObject<Array<FactionRank>>(DefaultRanks);
        const defaultSettings = deepCloneObject<FactionSettings>(DefaultSettings);
        for (let i = 0; i < defaultRanks.length; i++) {
            defaultRanks[i].uid = sha256Random(JSON.stringify(defaultRanks[i]));
        }
        const faction: Faction = {
            ..._faction,
            members: {},
            ranks: defaultRanks,
            vehicles: [],
            storages: [],
            actions: {},
            tickActions: [],
            settings: defaultSettings,
        };
        const document = await Database.insertData<Faction>(faction, Collections.Factions, true);
        if (!document) return { status: false, response: `Firma wurde nicht gespeichert.` };
        character.faction = document._id.toString();
        await Database.updatePartialData(character._id, { faction: character.faction }, Collections.Characters);
        const target = alt.Player.all.find((x) => x && x.data && x.data._id.toString() === character._id.toString());
        if (target) target.data.faction = character.faction;
        InternalFunctions.create(document);
        return { status: true, response: document._id.toString() };
    }

    /**
     * Used to update faction data, and automatically propogate changes for
     * users with faction panel open.
     *
     * @static
     * @param {string} _id
     * @param {Partial<Faction>} partialObject
     * @return {Promise<IGenericResponse<string>>}
     * @memberof FactionCore
     */
    static async update(_id: string, partialObject: Partial<Faction>): Promise<IGenericResponse<string>> {
        const faction = factions[_id];
        if (!faction) return { status: false, response: `Firma mit der ID ${_id} wurde nicht gefunden` };
        Object.keys(faction).forEach((key) => {
            if (!partialObject[key]) return;
            faction[key] = partialObject[key];
        });
        await Database.updatePartialData(faction._id, partialObject, Collections.Factions);
        return { status: true, response: `Firmendaten wurden aktualisiert` };
    }

    /**
     * Deletes the faction forever
     * Remove all players from the faction
     * Remove all vehicles from the faction (deleted)
     * Remove all storages from the faction (deleted)
     * Faction Bank is sent to owner of faction
     *
     * @static
     * @param {string} _id
     * @memberof FactionCore
     */
    static async remove(_id: string): Promise<IGenericResponse<string>> {
        // Find the faction...
        const faction = factions[_id];
        if (!faction) return { status: false, response: `Firma nicht mit der ID ${_id} gefunden` };
        // Remove the faction outright...
        const factionClone = deepCloneObject<Faction>(faction);
        delete factions[_id];

        // Fetch faction owner...
        const ownerIdentifier = await new Promise((resolve: Function) => {
            Object.keys(factionClone.members).forEach((key) => {
                if (!factionClone.members[key].hasOwnership) {
                    return;
                }
                return resolve(factionClone.members[key].id);
            });
        });

        // Clear all members...
        const members = await Database.fetchAllByField<Character>('faction', factionClone.name, Collections.Characters);
        const banking = await Database.fetchData<BankInfo>('owner', factionClone.name, Collections.Banks);
        let onlinePlayers: Array<alt.Player> = [];
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            member.faction = null;
            const player = alt.Player.all.find((p) => p.data && p.data._id === members[i]._id);
            if (player && player.valid) {
                triallife.state.set(player, 'faction', null);
                // Add bank balance to owner character
                if (player.data._id === ownerIdentifier) {
                    const banks = (await triallife.player.currency.getAllBankAccountsPlayer(player)).filter((x) => x.type === 'private' || x.type === 'credit');
                    const prive = banks.find((x) => x.type === 'private');
                    const credit = banks.find((x) => x.type === 'credit');
                    var money = banking.amount;
                    if (credit && credit.amount - money <= -1) {
                        money = money - credit.amount;
                        await triallife.player.currency.setBank(player, 0, credit.iban);
                    }
                    if (prive) {
                        await triallife.player.currency.addBank(player, money, prive.iban);
                        money = 0;
                    } else {
                        player.data.cash = player.data.cash + money;
                        money = 0;
                    }
                    await Database.deleteById(banking._id, Collections.Banks);
                    triallife.state.set(player, 'cash', player.data.cash, true);
                    triallife.player.sync.currencyData(player);
                    triallife.player.emit.notification(player, `+ ${factionClone.bank} $`);
                    if (banking) await Database.deleteById(banking._id, Collections.Banks);
                }
                onlinePlayers.push(player);
            }

            // For non-logged in character owner add bank balance
            if (!player && member._id === ownerIdentifier) {
                var amount = factionClone.bank;
                await Database.updatePartialData(member._id.toString(), { faction: null }, Collections.Characters);
                var facAcc = await Database.fetchData<BankInfo>('owner', factionClone.name, Collections.Banks);
                var privAcc = (await Database.fetchAllData<BankInfo>(Collections.Banks)).find((x) => x.type === 'private' && x.owner === member.name);
                if (facAcc) amount += facAcc.amount;
                if (privAcc) {
                    privAcc.amount += amount;
                    await Database.updatePartialData(privAcc._id, { amount: privAcc.amount }, Collections.Banks);
                    await Database.deleteById(facAcc._id, Collections.Banks);
                }
                continue;
            }

            // Remove faction from character
            await Database.updatePartialData(member._id.toString(), { faction: null }, Collections.Characters);
        }

        // Clear all vehicles...
        for (let i = 0; i < factionClone.vehicles.length; i++) {
            const vehicleId = factionClone.vehicles[i];
            const vehicle = alt.Vehicle.all.find((v) => v && v.valid && v.data && v.data._id === vehicleId);

            if (vehicle) {
                vehicle.destroy();
            }

            await Database.deleteById(vehicleId, Collections.Vehicles);
        }

        // Force close storage...
        for (let i = 0; i < onlinePlayers.length; i++) {
            if (!onlinePlayers[i] || !onlinePlayers[i].valid) {
                continue;
            }

            StorageView.close(onlinePlayers[i]);
        }

        // Delete storage...
        if (factionClone.storages && Array.isArray(factionClone.storages)) {
            for (let i = 0; i < factionClone.storages.length; i++) {
                const storageId = factionClone.storages[i];
                await Database.deleteById(storageId, Collections.Storage);
            }
        }
        await Database.deleteById(factionClone._id, Collections.Factions);
        return { status: true, response: `Firma wurde erfolgreich gelöscht` };
    }

    /**
     * Get faction data by identifier...
     *
     * @static
     * @param {string} _id
     * @return {Faction}
     * @memberof FactionCore
     */
    static get(_id: string): Faction {
        return factions[_id];
    }

    /**
     * Find a faction by name.
     *
     * @static
     * @param {string} nameOrPartialName
     * @return {*}  {(Faction | null)}
     * @memberof FactionCore
     */
    static find(nameOrPartialName: string): Faction | null {
        nameOrPartialName = nameOrPartialName.replace(/ /g, '').toLowerCase();
        const factionsList = Object.values(factions) as Array<Faction>;
        const index = factionsList.findIndex((f) => {
            const adjustedName = f.name.replace(/ /g, '').toLowerCase();
            if (adjustedName.includes(nameOrPartialName)) return true;
            return false;
        });
        if (index <= -1) return null;
        return factionsList[index];
    }

    /**
     * Return an array of all factions
     *
     * @static
     * @return {*}
     * @memberof FactionCore
     */
    static getAllFactions() {
        return Object.values(factions) as Array<Faction>;
    }

    /**
     * Reloads blips, markers, parking spots, etc.
     *
     * @static
     * @param {Faction} faction
     * @memberof FactionFuncs
     */
    static updateSettings(faction: Faction) {
        if (!faction.settings) return;
        if (faction.settings.blip && faction.settings.blip > -1) {
            triallife.controllers.blip.append({
                uid: faction._id.toString(),
                color: faction.settings.blipColor,
                sprite: faction.settings.blip,
                pos: faction.settings.position,
                scale: 1,
                text: faction.name,
                shortRange: true,
            });
        } else triallife.controllers.blip.remove(faction._id.toString());
    }
}
