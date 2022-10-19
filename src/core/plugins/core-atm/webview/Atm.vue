<template>
    <Frame minWidth="70vw" maxWidth="40vw">
        <template v-slot:toolbar>
            <Toolbar @close-page="relayClosePage" pageName="Atm">Bankautomat</Toolbar>
        </template>
        <template v-slot:content>
            <!-- Hand Money Info -->
            <div class="split space-between pa-5 outlined" @click="selectAccount(-1)">
                <div :class="getBankColor + '--text overline'">Bargeld</div>
                <div :class="getBankColor + '--text text--subtitle-2'">$ {{ showCashRight }}</div>
            </div>
            <!-- Bank Accounts Group -->
            <div class="split split-center ma-5">
                <v-card :class="'split-full ' + (index <= banks.length - 1 ? 'mr-2' : '')" v-for="(bank, index) in banks">
                    <Button :color="setBankColor(index)" :raise="bank._id === bank._id" @click="selectAccount(index)">
                        {{ getBankType(bank.type) }}
                    </Button>
                    <v-card-text class="fill-full-width mt-2 grey darken-1">
                        <div class="split split-center no-select grey darken-1 pa-2">
                            IBAN:&nbsp;<div class="no-select">{{ bank.iban }}</div>
                        </div>
                        <div class="split split-center no-select grey darken-2 pa-2">
                            Kontostand:&nbsp;<div class="no-select">{{ showBankAmount(index) }}</div>
                        </div>
                        <div class="split split-center no-select grey darken-1 pa-2">
                            Inhaber:&nbsp;<div class="no-select">{{ showBankOwner(index) }}</div>
                        </div>
                        <div class="split split-center no-select grey darken-2 pa-2">
                            Bank:&nbsp;<div class="no-select">{{ bank.name }}</div>
                        </div>
                    </v-card-text>
                </v-card>
                <v-card :class="'split-full ' + (n < 3 ? 'mr-2' : '')" v-for="n in 3 - banks.length">
                    <v-card-text class="split split-center outlined">
                        <Icon icon="icon-plus" :size="128" :no-select="true"></Icon>
                        <span class="split center">Sie können weitere Konten durch die Banken erhalten</span>
                    </v-card-text>
                </v-card>
            </div>
            <!-- Options Group -->
            <div class="split split-center outlined">
                <div class="split-center ma-5">
                    <Button class="mb-2" :raise="setting === 0" :color="getBankColor" @click="selectSetting(0)" :disable="!(bank && bank._id)">Einzahlung</Button>
                    <Button class="mb-2" :raise="setting === 1" :color="getBankColor" @click="selectSetting(1)" :disable="!(bank && bank._id)">Auszahlung</Button>
                    <Button class="mb-2" :raise="setting === 2" :color="getBankColor" @click="selectSetting(2)" :disable="!(bank && bank._id)">Überweisung</Button>
                    <Button class="mb-0" :raise="setting === 3" :color="getBankColor" @click="selectSetting(3)" :disable="!(bank && bank._id)">Kontoauszug</Button>
                </div>
                <div class="split-center ma-5">
                    <Icon :icon="getIconFromOption" :class="getBankColor + '--text split-full'" :size="128" :no-select="true"></Icon>
                </div>
                <div class="split-full ma-5">
                    <component class="split-full" v-bind:is="options[setting]" v-bind:cash="cash" v-bind:bank="bank" v-bind:color="getBankColor" />
                </div>
            </div>
        </template>
    </Frame>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

export const ComponentName = 'Atm';
export default defineComponent({
    name: ComponentName,
    components: {
        Deposit: defineAsyncComponent(() => import('./components/Deposit.vue')),
        Withdraw: defineAsyncComponent(() => import('./components/Withdraw.vue')),
        Transfer: defineAsyncComponent(() => import('./components/Transfer.vue')),
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            cash: 0,
            banks: [],
            bank: {},
            colors: ['green', 'blue', 'orange', 'red'],
            options: ['Deposit', 'Withdraw', 'Transfer', 'Banklog'],
            setting: -1,
        };
    },
    methods: {
        getBankType(type: string) {
            switch (type) {
                case 'private':
                    return 'Privatkonto';
                case 'concern':
                    return 'Firmenkonto';
                default:
                    return 'Kreditkonto';
            }
        },
        setBankColor(index: number) {
            var bankname: string = this.banks[index].name;
            switch (bankname) {
                case 'Pacific Standard Bank':
                    return 'blue';
                case 'Maze Bank':
                    return 'red';
                case 'Fleeca Bank':
                    return 'green';
                case 'International Bank':
                    return 'orange';
                default:
                    return 'grey';
            }
        },
        selectAccount(index: number) {
            this.selectSetting(this.banks[index] ? 0 : -1);
            if (this.banks[index]) this.bank = Object.assign({}, this.banks[index]);
            else this.bank = Object.assign({}, {});
        },
        showBankAmount(index: number) {
            if (this.banks.length <= 0) return 0;
            var parts = this.banks[index].amount.toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return parts.join(',');
        },
        showBankOwner(index: number) {
            if (this.banks.length <= 0) return 'Unbekannt';
            return this.banks[index].owner;
        },
        relayClosePage() {
            this.$emit('close-page', `${ComponentName}:Close`);
        },
        selectSetting(value) {
            this.setting = value;
        },
        isSetting(value) {
            if (value === this.setting && this.bank && this.bank._id) return { active: true };
            return {};
        },
        updateBalances(banks, cash) {
            this.cash = cash;
            this.banks = banks;
        },
        handlePress(e) {
            if (e.keyCode !== 27) return;
            if (!('alt' in window)) return;
            alt.emit(`${ComponentName}:Close`);
        },
    },
    computed: {
        getRandomIban() {
            var iban = 'LS43287901';
            for (let i = 0; i < 12; i++) {
                iban += Math.floor(Math.random() * 9);
            }
            return [...iban]
                .map((d, i) => (i % 4 === 0 ? ` ${d}` : d))
                .join('')
                .trim();
        },
        getIconFromOption() {
            if (!this.bank && !this.bank.id) return 'icon-ban';
            switch (this.setting) {
                case 0:
                    return 'icon-arrow_downward';
                case 1:
                    return 'icon-arrow_upward';
                case 2:
                    return 'icon-compare_arrows';
                case 3:
                    return 'icon-list-numbered';
                default:
                    return 'icon-ban';
            }
        },
        getBankColor() {
            var bankname: string = this.bank.name;
            switch (bankname) {
                case 'Pacific Standard Bank':
                    return 'blue';
                case 'Maze Bank':
                    return 'red';
                case 'Fleeca Bank':
                    return 'green';
                case 'International Bank':
                    return 'orange';
                default:
                    return 'grey';
            }
        },
        showCashRight() {
            var parts = this.cash.toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return parts.join(',');
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on(`${ComponentName}:Update`, this.updateBalances);
            alt.emit(`${ComponentName}:Ready`);
            alt.emit('ready');
        } else {
            const cash = Math.floor(Math.random() * 5000000);
            const banks = [
                {
                    _id: 1,
                    iban: this.getRandomIban,
                    name: 'Fleeca Bank',
                    owner: 'Sony Vegas',
                    amount: Math.floor(Math.random() * 5000000),
                    type: 'private',
                },
            ];
            this.updateBalances(banks, cash);
            this.selectSetting(-1);
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);
        if ('alt' in window) {
            alt.off(`${ComponentName}:Update`, this.updateBalances);
        }
    },
});
</script>

<style scoped>
.outlined {
    box-shadow: 0 0 10px grey inset;
}
</style>
