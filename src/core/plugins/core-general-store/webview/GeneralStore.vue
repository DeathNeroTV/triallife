<template>
    <div class="container">
        <span class="price-all pr-3"> {{ getFixedPrice }}</span>
        <div class="money pl-4 pb-2 green--text text--lighten-1">{{ getMoney }}</div>
        <!-- Right Panel -->
        <div class="creator stack">
            <!-- Navigation -->
            <Navigation v-bind:page-index="pageIndex" v-bind:pages="pages" v-bind:page-name="pageName" @next="nextPage" @prev="prevPage" />
            <!-- Actual Page -->
            <template v-if="page">
                <Option v-bind:page="page" v-bind:basket="basket" @handle-basket="handleBasket" />
            </template>
            <!-- Purchase Options -->
            <div class="footer pa-5" v-if="page">
                <div class="split split-center">
                    <template v-if="hasEnoughMoneyAll()">
                        <Button class="fill-full-width mr-3" color="green" @click="purchaseAll">
                            <span class="green--text">{{ getPurchaseAllText }}</span>
                        </Button>
                    </template>
                    <template v-else>
                        <Button class="fill-full-width mr-3" color="grey" :disable="true">
                            <span class="grey--text">{{ getPurchaseAllText }}</span>
                        </Button>
                    </template>
                    <Button class="fill-full-width" color="grey" @click="handleClose">
                        <span class="red--text">{{ getExitText }}</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { EXAMPLE_GENERAL_DATA } from './utility/exampleData';
import { DEFAULT_GENERAL_STORE } from './utility/defaultData';
import { LOCALE_GENERAL } from '../shared/locales';
import { deepCloneObject } from '../../../shared/utility/deepCopy';
import { Item } from '../../../shared/interfaces/item';

const ComponentName = 'GeneralStore';
export default defineComponent({
    name: ComponentName,
    props: {
        emit: Function,
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Input: defineAsyncComponent(() => import('@components/Input.vue')),
        RangeInput: defineAsyncComponent(() => import('@components/RangeInput.vue')),
        Option: defineAsyncComponent(() => import('./components/Option.vue')),
        Navigation: defineAsyncComponent(() => import('./components/Navigation.vue')),
    },
    data() {
        return {
            // New stuff
            pageIndex: 0,
            pageName: '',
            money: 0,
            basket: [],
            page: {},
            pages: [],
            labels: [],
            allValid: false,
            storeData: DEFAULT_GENERAL_STORE,
        };
    },
    computed: {
        getLabels() {
            return this.pages[this.pageIndex];
        },
        getIDs() {
            return this.pages[this.pageIndex].ids;
        },
        getPurchaseText() {
            return LOCALE_GENERAL.LABEL_PURCHASE;
        },
        getPurchaseAllText() {
            return LOCALE_GENERAL.LABEL_PURCHASE_ALL;
        },
        getExitText() {
            return LOCALE_GENERAL.LABEL_EXIT;
        },
        getFixedPrice() {
            var parts = this.getAllPricing().toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `Kosten: ${parts.join(',')} $`;
        },
        getItemPriceText() {
            return LOCALE_GENERAL.LABEL_ITEM;
        },
        getMoney() {
            var parts = this.money.toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `${parts.join(',')} $`;
        },
    },
    methods: {
        nextPage() {
            if (this.pageIndex + 1 >= this.pages.length) this.pageIndex = 0;
            else this.pageIndex += 1;
            this.setPage(this.pageIndex);
        },
        prevPage() {
            if (this.pageIndex - 1 <= -1) this.pageIndex = this.pages.length - 1;
            else this.pageIndex -= 1;
            this.setPage(this.pageIndex);
        },
        setPage(index: number) {
            this.pageName = this.pages[index].pageName;
            this.page = this.pages[index];
        },
        setBankData(money: number) {
            this.money = money;
        },
        hasEnoughMoneyAll() {
            const price = this.getAllPricing();
            if (price <= 0) return false;
            if (this.money < price) return false;
            return true;
        },
        getAllPricing() {
            let price = 0.0;
            for (let i = 0; i < this.basket.length; i++) {
                price += this.basket[i].quantity * this.basket[i].buy;
            }
            return price;
        },
        purchaseAll() {
            if (!('alt' in window)) return;
            const items: Array<Item> = [];
            const uid: string = this.storeData.uid;
            this.basket.forEach((item: Item) => items.push(item));
            alt.emit(`${ComponentName}:PurchaseAll`, items, uid);
        },
        handlePress(e) {
            if (e.keyCode !== 27) return;
            this.handleClose();
        },
        handleClose() {
            if (!('alt' in window)) return;
            alt.emit(`${ComponentName}:Close`);
        },
        setData(data) {
            this.storeData = data;
            const pagesToRemove = [...this.storeData.hiddenPages];
            const currentLabels = [...this.labels];
            for (let i = currentLabels.length - 1; i >= 0; i--) {
                const pageIndex = pagesToRemove.findIndex((id) => id === i);
                if (pageIndex <= -1) continue;
                currentLabels.splice(i, 1);
            }
            for (let i = 0; i < this.pages.length; i++) {
                this.pages[i].items = this.storeData.items[i];
            }
            this.labels = currentLabels;
        },
        handleBasket(index: number, quantity: number) {
            const item = this.pages[this.pageIndex].items[index];
            if (!item) return;
            if (item.quantity < quantity) return;
            const clone = deepCloneObject<Item>(item);
            clone.quantity = quantity;
            item.quantity = item.quantity - quantity;
            this.pages[this.pageIndex].items[index] = item;
            const idx = this.basket.findIndex((x) => x.name === item.name);
            if (idx === -1 && quantity > 0) this.basket.push(clone);
            else {
                if (quantity === 0) this.basket.splice(idx, 1);
                else this.basket[idx].quantity = quantity;
            }
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);
        // Set Default Example Data
        this.pages = EXAMPLE_GENERAL_DATA;
        this.setPage(this.pageIndex);
        if ('alt' in window) {
            alt.on(`${ComponentName}:SetData`, this.setData);
            alt.on(`${ComponentName}:SetBankData`, this.setBankData);
            alt.emit(`${ComponentName}:Ready`);
        } else this.money = 500000;
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);
        if ('alt' in window) {
            alt.off(`${ComponentName}:SetData`, this.setData);
            alt.off(`${ComponentName}:SetBankData`, this.setBankData);
        }
    },
});
</script>

<style scoped>
/* This style is applied to only this page */
.container {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, rgba(0, 0, 0, 1), transparent 35%);
}

.price-item {
    position: fixed;
    top: 48px;
    right: 402px;
    z-index: 99;
    text-shadow: 2px 2px 2px black;
    font-size: 16px !important;
}

.price-item-invalid {
    position: fixed;
    top: 48px;
    right: 402px;
    z-index: 99;
    text-shadow: 2px 2px 2px black;
    font-size: 16px !important;
    color: rgba(200, 50, 50, 1);
}

.price-all {
    position: fixed;
    top: 6px;
    right: 400px;
    z-index: 99;
    text-shadow: 1px 1px 1px black, 1px -1px 1px black, -1px 1px 1px black, -1px -1px 1px black;
    font-size: 32px !important;
}

.creator {
    position: fixed;
    min-width: 400px;
    max-width: 400px;
    min-height: 100vh;
    max-height: 100vh;
    background: rgba(12, 12, 12, 1) !important;
    right: 0;
    border-left: 2px solid rgba(64, 64, 64, 1);
}

.navigation {
    min-height: 100px;
    max-height: 100px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.split {
    box-sizing: border-box;
}

.escape {
    top: 2vh;
    left: 2vw;
}

.footer {
    display: flex;
    flex-direction: column;
    min-height: auto;
    max-height: auto;
    box-sizing: border-box;
    width: 100%;
}

.price {
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    text-align: left;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
}

.money {
    position: fixed;
    bottom: 0px;
    left: 0px;
    font-family: 'Roboto';
    font-size: 26px;
    font-weight: 600;
    text-shadow: 1px 1px black;
    z-index: 99;
}

.footer {
    background: url('../../../../../assets/images/bg.png');
}

.smooth-button {
    border-radius: 6px;
}
</style>
