import * as alt from 'alt-server';
import { BankInfo } from '../../../shared/interfaces/bank';
import { triallife } from '../../api/triallife';
import { StateManager } from '../../systems/stateManager';
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
            StateManager.set(player, 'cash', player.data.cash);
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
            StateManager.set(player, 'cash', player.data.cash);
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
            StateManager.set(player, 'cash', player.data.cash);
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
            if (player) {
                const banksNew = await Currency.getAllBankAccountsPlayer(player);
                triallife.player.emit.meta(player, 'banks', banksNew);            
                StateManager.set(player, 'banks', banksNew);
            }
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
                const banksNew = await Currency.getAllBankAccountsPlayer(player);
                triallife.player.emit.meta(player, 'banks', banksNew);            
                StateManager.set(player, 'banks', banksNew);
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
                const banksNew = await Currency.getAllBankAccountsPlayer(player);
                triallife.player.emit.meta(player, 'banks', banksNew);            
                StateManager.set(player, 'banks', banksNew);
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
            amountLeft -= startCash;
            startCash = 0;
        } else {
            startCash -= amountLeft;
            amountLeft = 0;
        }
        StateManager.set(player, 'cash', startCash);
        emit.meta(player, 'cash', startCash);
        save.save(player, 'cash', startCash);
        //Check Private Bank Account for Payment
        const allBanks = await Currency.getAllBankAccountsPlayer(player);
        if (amountLeft > 0) {
            const indexPriv = allBanks.findIndex((x) => x.owner === player.data._id.toString() && x.type === 'private');
            if (indexPriv !== -1) {
                startCash = allBanks[indexPriv].amount;
                if (allBanks[indexPriv].amount - amountLeft <= -1) {
                    amountLeft -= allBanks[indexPriv].amount;
                    startCash = 0;
                } else {
                    startCash -= amountLeft;
                    amountLeft = 0;
                }
                await triallife.database.funcs.updatePartialData(allBanks[indexPriv]._id, { amount: startCash }, triallife.database.collections.Banks);
            }
        }
        //Check Credit Bank Account for Payment
        if (amountLeft > 0) {        
            const indexCred = allBanks.findIndex((x) => x.owner === player.data._id.toString() && x.type === 'credit');
            if (indexCred !== -1) {
                startCash = allBanks[indexCred].amount;
                if (startCash > Number.MAX_VALUE - amountLeft) {
                    const banned = { state: true, reason: 'Zu hoch verschuldet' };
                    StateManager.set(player, 'banned', banned);
                    emit.meta(player, 'banned', banned);
                    save.save(player, 'banned', banned);
                    player.kick('Sie sind zu hoch verschuldet. Bitte melden Sie sich beim Support!'); 
                    return false;
                } else {
                    startCash += amountLeft;
                    amountLeft = 0;
                }
                await triallife.database.funcs.updatePartialData(allBanks[indexCred]._id, { amount: startCash }, triallife.database.collections.Banks);
            }
            StateManager.set(player, 'banks', allBanks);
            emit.meta(player, 'banks', allBanks);
        }
        return amountLeft === 0;
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
            if (bank) {
                bank._id = bank._id.toString();
                banks.push(bank);
            }
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
