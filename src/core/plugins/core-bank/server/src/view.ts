import * as alt from 'alt-server';

import banks from '../../../../shared/information/banks';
import { ServerBlipController } from '../../../../server/systems/blip';
import { InteractionController } from '../../../../server/systems/interaction';
import Database from '@stuyk/ezmongodb';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { BANK_INTERACTIONS } from '../../shared/events';
import { triallife } from '../../../../server/api/triallife';
import { BankInfo } from '../../../../shared/interfaces/bank';
import { FactionHandler } from '../../../core-factions/server/src/handler';
import { FactionFuncs } from '../../../core-factions/server/src/funcs';

const INTERACTION_RANGE = 1.5;
class InternalFunctions {
    static async create(player: alt.Player, name: string, type: string): Promise<void> {
        var iban = await InternalFunctions.generateIban(player, name);
        while (await InternalFunctions.ibanExists(iban)) {
            iban = await InternalFunctions.generateIban(player, name);
        }
        var banks = await triallife.player.currency.getAllBankAccountsPlayer(player);
        if (type === 'concern') {
            if (!player.data.faction) {
                triallife.player.emit.notification(player, 'Sie sind in keiner Firma');
                triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }
            const faction = FactionHandler.get(player.data.faction);
            if (!faction && !FactionFuncs.getFactionOwner(faction).id === player.data._id.toString()) {
                triallife.player.emit.notification(player, 'Sie sind nicht der Firmeninhaber');
                triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }
            var bank = await Database.fetchData<BankInfo>('owner', faction._id.toString(), Collections.Banks);            
            if (bank) {
                triallife.player.emit.notification(player, 'Sie haben bereits ein Firmenkonto.');
                triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }
            var bankNew: BankInfo = { amount: 0.0, logs: [], iban, name, type, owner: player.data.faction };
            var document = await Database.insertData<BankInfo>(bankNew, Collections.Banks, true);
            banks.push(document);
            triallife.state.set(player, 'banks', banks);
            triallife.player.emit.meta(player, 'banks', banks);
            triallife.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        } else {
            var bank = banks.find((x) => x.owner === player.data._id.toString() && x.type === type);
            if (bank) {
                triallife.player.emit.notification(player, `Sie haben bereits ein Konto dieser Art`);
                triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }
            var bank: BankInfo = { amount: 0.0, logs: [], iban, name, type, owner: player.data._id.toString() };
            var document = await Database.insertData<BankInfo>(bank, Collections.Banks, true);
            banks.push(document);
            triallife.state.set(player, 'banks', banks);
            triallife.player.emit.meta(player, 'banks', banks);
            triallife.player.emit.notification(player, `Das Konto wurde für Sie eingerichtet.`);
            triallife.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        }
    }

    static async remove(player: alt.Player, id: string): Promise<void> {
        const bank = (await triallife.player.currency.getAllBankAccountsPlayer(player)).find(x => x._id.toString() === id);
        if (!bank) {
            triallife.player.emit.notification(player, `Das Konto wurde nicht gefunden.`);
            triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }
        if (bank.type === 'concern') {
            const faction = FactionHandler.get(bank.owner);
            if (!faction || FactionFuncs.getFactionOwner(faction).id === player.data._id.toString()) {
                triallife.player.emit.notification(player, `Sie sind kein Firmeninhaber.`);
                triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }
            faction.bank += bank.amount;
            await FactionHandler.update(faction._id.toString(), { bank: faction.bank });
        } else if (bank.type === 'credit') {
            var amountLeft = bank.amount;
            const privBank = (await triallife.player.currency.getAllBankAccountsPlayer(player)).find(x => x.type === 'private');
            const concBank = (await triallife.player.currency.getAllBankAccountsPlayer(player)).find(x => x.type === 'concern');
            var startCash = privBank.amount;
            if (privBank) {
                if (privBank.amount - bank.amount <= -1) {
                    amountLeft -= startCash;
                    startCash = 0;
                } else {
                    startCash -= amountLeft;
                    amountLeft = 0;
                }
                await triallife.player.currency.setBank(player, startCash, privBank._id.toString());
            }
            if (amountLeft > 0) {
                if (concBank) {
                    var startCash = concBank.amount;
                    if (concBank.amount - bank.amount <= -1) {
                        amountLeft -= startCash;
                        startCash = 0;
                    } else {
                        startCash -= amountLeft;
                        amountLeft = 0;
                    }
                    await triallife.player.currency.setBank(player, startCash, concBank._id.toString());
                }
            }
            if (amountLeft > 0) {
                startCash = player.data.cash;
                if (player.data.cash - amountLeft <= -1) {
                    amountLeft -= startCash;
                    startCash = 0; 
                } else {
                    startCash -= amountLeft;
                    amountLeft = 0;
                }
                triallife.player.currency.set(player, startCash);
            }
            if (amountLeft > 0) {
                bank.amount = amountLeft;
                await triallife.player.currency.setBank(player, amountLeft, bank._id.toString());
                triallife.player.emit.notification(player, `Ihr Kredit ist noch nicht abbezahlt worden!`);
                triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }
        } else triallife.player.currency.add(player, amountLeft);
        await Database.deleteById(id, Collections.Banks);
        const banks = await triallife.player.currency.getAllBankAccountsPlayer(player);
        triallife.state.set(player, 'banks', banks);
        triallife.player.emit.meta(player, 'banks', banks);
        triallife.player.emit.notification(player, `Das Konto wurde aufgelöst.`);
        triallife.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }

    static async generateIban(player: alt.Player | null, bankName: string): Promise<string> {
        var knr: string = '';
        var blz: string = '';
        switch (bankName) {
            case 'Pacific Standard Bank':
                blz = 'LS4389029921';
                break;
            case 'Fleeca Bank':
                blz = 'LS4389028637';
                break;
            case 'Maze Bank':
                blz = 'LS4389025976';
                break;
            default:
                break;
        }
        for (let i: number = 0; i < 10; i++) {
            knr += InternalFunctions.getRandomInRange(0, 10).toString();
            if (player) triallife.player.emit.soundFrontend(player, 'PICKUP_WEAPON_BALL', 'HUD_FRONTEND_WEAPONS_PICKUPS_SOUNDSET');
        }
        var iban = `${blz}${knr}`;
        return [...iban]
            .map((d, i) => (i % 4 === 0 ? ` ${d}` : d))
            .join('')
            .trim();
    }

    static getRandomInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static async ibanExists(iban: string): Promise<Boolean> {
        let document = await Database.fetchData<BankInfo>('iban', iban, Collections.Banks);
        if (document) return true;
        return false;
    }
}

export class BankFunctions {
    static init() {
        for (let i = 0; i < banks.length; i++) {
            const position = { x: banks[i].x, y: banks[i].y, z: banks[i].z };
            var color: number = 0;
            switch (banks[i].color) {
                case 'red':
                    color = 1;
                    break;
                case 'green':
                    color = 2;
                    break;
                case 'blue':
                    color = 3;
                    break;
                default:
                    color = 47;
                    break;
            }
            ServerBlipController.append({
                text: banks[i].name,
                color: color,
                sprite: 374,
                scale: 1,
                shortRange: true,
                pos: position,
                uid: `${banks[i].name}-${i}`,
            });
            InteractionController.add({
                position,
                description: 'Konten verwalten',
                range: INTERACTION_RANGE,
                callback: (player: alt.Player) => alt.emitClient(player, BANK_INTERACTIONS.OPEN, banks[i].name, banks[i].color, player.data.name),
                isPlayerOnly: true,
                debug: false,
            });
        }
    }
}

alt.onClient(BANK_INTERACTIONS.CREATE, InternalFunctions.create);
alt.onClient(BANK_INTERACTIONS.REMOVE, InternalFunctions.remove);
