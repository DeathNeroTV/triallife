import * as alt from 'alt-server';
import { BankInfo } from '../../../shared/interfaces/bank';
import { triallife } from '../../api/triallife';
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
            if (typeof player.data.cash === 'undefined') player.data.cash = 0;
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

    async addBank(player: alt.Player | null, amount: number, _id: string): Promise<boolean> {
        if (typeof amount === 'string') amount = parseFloat(amount);
        try {
            const bank = await triallife.database.funcs.fetchData<BankInfo>('_id', _id, triallife.database.collections.Banks);
            if (!bank) return false;
            await triallife.database.funcs.updatePartialData(bank._id, { amount: bank.amount + amount }, triallife.database.collections.Banks);
            const banksNew = await Currency.getAllBankAccountsPlayer(player);
            if (player) triallife.player.emit.meta(player, 'banks', banksNew);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    async subBank(player: alt.Player | null, amount: number, _id: string): Promise<boolean> {
        if (typeof amount === 'string') amount = parseFloat(amount);
        try {
            const bank = await triallife.database.funcs.fetchData<BankInfo>('_id', _id, triallife.database.collections.Banks);
            await triallife.database.funcs.updatePartialData(bank._id, { amount: bank.amount - amount }, triallife.database.collections.Banks);
            if (player) {
                const banks = await Currency.getAllBankAccountsPlayer(player);
                triallife.player.emit.meta(player, 'banks', banks);
            }
            return true;
        } catch (err) {
            return false;
        }
    },

    async setBank(player: alt.Player | null, amount: number, _id: string): Promise<boolean> {
        try {
            await triallife.database.funcs.updatePartialData(_id, { amount }, triallife.database.collections.Banks);
            if (player) {
                const banks = await Currency.getAllBankAccountsPlayer(player);
                triallife.player.emit.meta(player, 'banks', banks);
            }
            return true;
        } catch (err) {
            return false;
        }
    },

    async subAllCurrencies(player: alt.Player, amount: number): Promise<boolean> {
        if (typeof player.data.cash === 'undefined') player.data.cash = 0;
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
            const banks = await Currency.getAllBankAccountsPlayer(player);
            const index = banks.findIndex((x) => x.owner === player.data._id.toString() && x.type === 'private');
            if (index !== -1) {
                if (banks[index].amount - amountLeft <= -1) {
                    amountLeft = amountLeft - banks[index].amount;
                    banks[index].amount = 0;
                } else {
                    banks[index].amount = banks[index].amount - amountLeft;
                    amountLeft = 0;
                }
                await triallife.database.funcs.updatePartialData(banks[index]._id, { amount: banks[index].amount }, triallife.database.collections.Banks);
            }
            emit.meta(player, 'banks', banks);
        }
        return true;
    },

    async getAllBankAccountsPlayer(player: alt.Player): Promise<Array<BankInfo>> {
        const banks = [];
        const documents = await triallife.database.funcs.fetchAllByField<BankInfo>('owner', player.data._id.toString(), triallife.database.collections.Banks);
        for(const bank of documents) {
            bank._id = bank._id.toString();
            banks.push(bank);
        }
        if (player.data.faction) {
            const bank = await triallife.database.funcs.fetchData<BankInfo>('owner', player.data.faction, triallife.database.collections.Banks);
            bank._id = bank._id.toString();
            banks.push(bank);
        }
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
