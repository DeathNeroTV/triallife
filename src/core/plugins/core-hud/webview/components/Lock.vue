<template>
    <div class="stat-wrapper">
        <div class="split space-between">
            <div class="bar">
                <Icon v-if="status" :shadow="false" :size="24" icon="icon-lock1" class="stat-icon stat-icon-on" />
                <Icon v-else :shadow="false" :size="24" icon="icon-unlock" class="stat-icon stat-icon-off" />
                <div class="bar-shadow"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'Lock';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    props: {
        status: {
            type: Boolean,
            default: true,
        },
    },
});
</script>

<style scoped>
.stat-wrapper {
    display: flex;
    flex-direction: row;
}

.bar {
    display: block;
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    min-width: 35px;
    max-width: 35px;
    min-height: 35px;
    max-height: 35px;
    border-radius: 25px;
    overflow: hidden;
    border: 2px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.bar-shadow {
    display: block;
    position: relative;
    box-sizing: border-box;
    min-width: 29px;
    max-width: 29px;
    min-height: 29px;
    max-height: 29px;
    border-radius: 50px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.3);
    z-index: 50;
    left: -4px;
    top: -4px;
    mix-blend-mode: overlay;
}

.stat-icon {
    display: flex;
    color: white;
    align-items: center;
    justify-content: center;
    min-width: 35px;
    max-width: 35px;
    min-height: 35px;
    max-height: 35px;
    position: absolute;
    z-index: 99;
    /* opacity: 0.5; */
    left: -4px;
    top: -2px;
    /* mix-blend-mode: lighten; */
    color: rgba(255, 255, 255, 0.5);
}

.stat-icon-off {
    color: limegreen;
    text-shadow: 0px 0px 6px limegreen;
}

.stat-icon-on {
    color: red;
    text-shadow: 0px 0px 6px red;
}
</style>
