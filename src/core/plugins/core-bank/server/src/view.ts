import * as alt from 'alt-server';

import banks from '../../../../shared/information/banks';
import { ServerBlipController } from '../../../../server/systems/blip';
import { InteractionController } from '../../../../server/systems/interaction';
import Database from '@stuyk/ezmongodb';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { BANK_INTERACTIONS } from '../../shared/events';
import { triallife } from '../../../../server/api/triallife';
import { BankInfo } from '../../../../shared/interfaces/bank';
import { Faction } from '../../../core-factions/shared/interfaces';

const INTERACTION_RANGE = 1.5;
class InternalFunctions {
    static async create(player: alt.Player, name: string, type: string): Promise<boolean> {
        var iban = await InternalFunctions.generateIban(name);
        while (await InternalFunctions.ibanExists(iban)) {
            iban = await InternalFunctions.generateIban(name);
        }
        var banks = await triallife.player.currency.getAllBankAccountsPlayer(player);
        if (type === 'concern') {
            if (!player.data.faction) return false;
            var concern = await Database.fetchData<Faction>('_id', player.data.faction, Collections.Factions);
            var bank = await Database.fetchData<BankInfo>('owner', concern.name, Collections.Banks);
            if (bank) return false;
            var bankNew: BankInfo = { amount: 0.0, logs: [], iban, name, type, owner: concern.name };
            var document = await Database.insertData<BankInfo>(bankNew, Collections.Banks, true);
            banks.push(document);
            triallife.player.emit.meta(player, 'banks', banks);
            return true;
        } else {
            var bank = banks.find((x) => x.owner === player.data.name && x.type === type);
            if (bank) return false;
            var bank: BankInfo = { amount: 0.0, logs: [], iban, name, type, owner: player.data.name };
            var document = await Database.insertData<BankInfo>(bank, Collections.Banks, true);
            banks.push(document);
            triallife.player.emit.meta(player, 'banks', banks);
            return true;
        }
    }

    static async remove(player: alt.Player, iban: string | null): Promise<boolean> {
        var banks = await triallife.player.currency.getAllBankAccountsPlayer(player);
        const index = banks.findIndex((x) => x.iban === iban);
        if (index === -1) return false;
        triallife.player.currency.add(player, banks[index].amount);
        await Database.deleteById(banks[index]._id, Collections.Banks);
        banks.splice(index, 1);
        triallife.player.emit.meta(player, 'banks', banks);
        return true;
    }

    static async generateIban(bankName: string): Promise<string> {
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
