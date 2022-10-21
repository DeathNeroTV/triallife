<template>
    <div class="split split-full navigation space-between pa-6">
        <Button color="green" @click="$emit('next')">
            <Icon class="green--text" :size="24" icon="icon-chevron-left" />
        </Button>
        <span class="pretty text-lg-h5 grey--text text--lighten-4 grey--glow">
            {{ pageName }}
        </span>
        <Button color="green" @click="$emit('prev')">
            <Icon class="green--text" :size="24" icon="icon-chevron-right" />
        </Button>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

const ComponentName = 'Navigation';
export default defineComponent({
    name: ComponentName,
    props: {
        pageIndex: {
            type: Number,
            required: true,
        },
        pages: {
            type: Object,
            required: true,
        },
        pageName: {
            type: String,
            required: true,
        },
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
});
</script>

<style>
.navigation {
    background: url('../../../../../../src-webviews/public/assets/images/bg.png');
}
</style>
