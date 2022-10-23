<template>
    <div class="wrapper stack">
        <Button v-for="(page, index) in pages" :key="index" :color="getButtonColor(index)" :raise="false" :style="getButtonStyle" :class="getButtonClass" @click="navigate(index)">
            {{ page.trans }}
        </Button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@components/Button.vue';

interface iPage {
    name: string;
    page: string;
    trans: string;
}

const ComponentName = 'Navigation';
export default defineComponent({
    name: ComponentName,
    props: {
        pages: {
            type: Array as () => Array<iPage>,
        },
        page: {
            type: Number,
        },
    },
    components: {
        Button,
    },
    computed: {
        getButtonStyle() {
            let style = '';
            style += 'background: transparent !important;';
            style += 'border: 0px !important;';
            return style;
        },
        getButtonClass() {
            return { 'mt-1': true, 'mb-1': true };
        },
    },
    methods: {
        getButtonColor(index: number) {
            return index === this.page ? 'green' : 'grey';
        },
        navigate(pageIndex: number) {
            this.$emit('navigate', pageIndex);
        },
    },
});
</script>

<style scoped>
.wrapper {
    overflow-y: auto;
    min-height: 100vh;
    max-height: 100vh;
    width: 100%;
    background-color: rgba(12, 12, 12, 1);
}
</style>
