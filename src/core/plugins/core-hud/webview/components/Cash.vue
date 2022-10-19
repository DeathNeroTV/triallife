<template>
    <div class="stat-wrapper">
        <Icon :shadow="true" icon="icon-money1" class="mr-2" :size="24" />
        <span class="cash overline mr-4">{{ getCashFixed }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'Cash';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    props: {
        value: {
            type: Number,
            default: 199,
        },
    },
    computed: {
        getCashFixed() {
            var parts = this.value.toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `${parts.join(',')}`;
        },
    },
});
</script>

<style scoped>
.stat-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
    position: relative;
    opacity: 0.75 !important;
}

.cash {
    font-family: 'Inter';
    font-size: 16px !important;
    font-weight: 600;
    text-shadow: 1px 1px black;
}
</style>
