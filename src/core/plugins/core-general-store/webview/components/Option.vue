<template>
    <div class="stack center-page pa-3">
        <div class="component stack pa-3 mb-3" v-for="(id, index) in page?.ids" :key="index" v-if="page?.items">
            <template v-for="(item, idx) in page?.items" :key="idx">
                <div class="split split-center mt-4 mb-4">
                    <RangeInput class="fill-full-width" :minIndex="0" :maxIndex="100" :incrementIndex="1" :indexValue="item.quantity" @input="e => changeQuantity(e, idx)"></RangeInput>
                </div>
                <div class="split split-center">
                    <span class="fill-full-width">{{ item.name }}</span>
                    <span class="fill-full-width">({{ getItemPriceFixed(item.quantity * item.buy) }}) {{ getItemPriceFixed(item.buy) }}</span>
                    <Button :color="basket?.findIndex(x => x.name === item.name) !== -1 ? 'red' : 'green'" @click="e => $emit('handle-basket', idx, item.quantity)">
                        <Icon :size="18" icon="icon-shopping-basket"></Icon>
                    </Button>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'Option';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
        RangeInput: defineAsyncComponent(() => import('@components/RangeInput.vue')),
    },
    data() {
        return {
            update: Date.now(),
            index: 0,
        };
    },
    props: {
        page: Object,
        basket: Array,
    },
    methods: {
        setQuantity(index: number, amount: number) {
            this.page.items[index].quantity = Math.max(0, Math.min(100, this.page.items[index].quantity + amount));
        },
        changeQuantity(e: Event, index: number) {
            if (!e.target) return;
            this.page.items[index].quantity = parseInt(e.target['value']);
        },
        getItemPriceFixed(amount: number) {
            var parts = amount ? amount.toFixed(2).split('.') : (0).toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `${parts.join(',')} $`;
        },
    },
});
</script>

<style scoped>
.component {
    border: 2px solid rgba(28, 28, 28, 1);
    box-sizing: border-box;
    background: url('../../../../../src-webviews/public/assets/images/bg.png');
    border-radius: 0;
}

.center-page {
    min-height: calc(100vh - 175px);
    max-height: calc(100vh - 175px);
    overflow-y: scroll;
    box-sizing: border-box;
    border-bottom: 2px solid rgba(28, 28, 28, 1);
}

.counter {
    min-width: 25px;
}
</style>
