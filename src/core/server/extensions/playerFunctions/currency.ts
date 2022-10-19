import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { Faction } from '../../../plugins/core-factions/shared/interfaces';
import { BankInfo } from '../../../shared/interfaces/bank';
import { triallife } from '../../api/triallife';
import { Collections } from '../../interface/iDatabaseCollections';
import emit from './emit';
import save from './save';

const Currency = {
    add(player: alt.Player, amount: number): boolean {
        if (typeof amount === 'string') amount = parseFloat(amount);
        try {
            const originalValue = player.data.cash!;
            player.data.cash = parseFloat((player.data.cash! + amount).toFixed(2));
            if (originalValue > player.data.cash!) {
                player.data.cash = originalValue;
                return false;
            }
            emit.meta(player, 'cash', player.data.cash);
            save.save(player, 'cash', player.data.cash);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    sub(player: alt.Player, amount: number): boolean {
        if (typeof amount === 'string') amount = parseFloat(amount);
        try {
            if (typeof player.data.cash === 'undefined') {
                player.data.cash = 0;
            }
            const originalValue = player.data.cash!;
            player.data.cash = parseFloat((player.data.cash! - amount).toFixed(2));
            if (originalValue < player.data.cash!) {
                player.data.cash = originalValue;
                return false;
            }
            emit.meta(player, 'cash', player.data.cash);
            save.save(player, 'cash', player.data.cash);
            return true;
        } catch (err) {
            return false;
        }
    },

    set(player: alt.Player, amount: number): boolean {
        try {
            player.data.cash = amount;
            emit.meta(player, 'cash', player.data.cash);
            save.save(player, 'cash', player.data.cash);
            return true;
        } catch (err) {
            return false;
        }
    },

    async addBank(player: alt.Player, amount: number, iban: string): Promise<boolean> {
        if (typeof amount === 'string') amount = parseFloat(amount);
        try {
            const banks = await Database.fetchAllData<BankInfo>(Collections.Banks);
            const index = banks.findIndex((x) => x.iban === iban);
            if (index === -1) return false;
            await Database.updatePartialData(banks[index]._id, { amount: banks[index].amount + amount }, Collections.Banks);
            const banksNew = await this.getAllBankAccountsPlayer(player);
            triallife.player.emit.meta(player, 'banks', banksNew);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    async subBank(player: alt.Player, amount: number, iban: string): Promise<boolean> {
        if (typeof amount === 'string') amount = parseFloat(amount);
        try {
            const bank = await Database.fetchData<BankInfo>('iban', iban, Collections.Banks);
            await Database.updatePartialData(bank._id, { amount: bank.amount - amount }, Collections.Banks);
            const banks = await this.getAllBankAccountsPlayer(player);
            triallife.player.emit.meta(player, 'banks', banks);
            return true;
        } catch (err) {
            return false;
        }
    },

    async setBank(player: alt.Player, amount: number, id: string): Promise<boolean> {
        try {
            await Database.updatePartialData(id, { amount }, Collections.Banks);
            const banks = await this.getAllBankAccountsPlayer(player);
            triallife.player.emit.meta(player, 'banks', banks);
            return true;
        } catch (err) {
            return false;
        }
    },

    async subAllCurrencies(player: alt.Player, amount: number): Promise<boolean> {
        if (typeof player.data.cash === 'undefined') {
            player.data.cash = 0;
        }
        let amountLeft = amount;
        let startCash = player.data.cash;
        if (player.data.cash - amountLeft <= -1) {
            amountLeft = amountLeft - startCash;
            startCash = 0;
        } else {
            startCash = startCash - amountLeft;
            amountLeft = 0;
        }
        triallife.state.set(player, 'cash', startCash);
        emit.meta(player, 'cash', player.data.cash);
        if (amountLeft > 0) {
            const banks = await this.getAllBankAccountsPlayer(player);
            const index = banks.findIndex((x) => x.owner === player.data.name && x.type === 'private');
            if (index !== -1) {
                if (banks[index].amount - amountLeft <= -1) {
                    amountLeft = amountLeft - banks[index].amount;
                    banks[index].amount = 0;
                } else {
                    banks[index].amount = banks[index].amount - amountLeft;
                    amountLeft = 0;
                }
                await Database.updatePartialData(banks[index]._id, { amount: banks[index].amount }, Collections.Banks);
            }
            emit.meta(player, 'banks', banks);
        }
        return true;
    },

    async getAllBankAccountsPlayer(player: alt.Player): Promise<Array<BankInfo>> {
        var banks = await Database.fetchAllData<BankInfo>(Collections.Banks);
        if (player.data.faction) {
            const faction = await Database.fetchData<Faction>('_id', player.data.faction, Collections.Factions);
            banks = faction ? banks.filter((x) => x.owner === faction.name || x.owner === player.data.name) : banks.filter((x) => x.owner === player.data.name);
        } else banks = banks.filter((x) => x.owner === player.data.name);
        return banks;
    },
};

function override<Key extends keyof typeof Currency>(functionName: Key, callback: typeof Currency[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`triallife.player.currency does not provide an export named ${functionName}`);
    }
    exports[functionName] = callback;
}

export const exports: typeof Currency & { override?: typeof override } = {
    ...Currency,
    override,
};

export default exports;
