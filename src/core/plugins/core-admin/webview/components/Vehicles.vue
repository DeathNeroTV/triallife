<template>
    <div class="wrapper stack split-center">
        <div class="split split-center fill-full-width pt-2 pb-2 outlined">
            <span class="split split-center fill-full-width center pt-2 pb-2 text-lg-h5">{{ title }}</span>
            <Button class="mr-2" color="green" :glow="true" :raise="true" @click="">
                <Icon icon="icon-add" :size="24"></Icon>
            </Button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ComponentName as PageName } from '../Admin.vue';

import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Input from '@components/Input.vue';

const ComponentName = 'Vehicles';
export default defineComponent({
    name: ComponentName,
    props: {
        title: String,
        list: Array,
    },
    data() {
        return {};
    },
    components: {
        Button,
        Icon,
        Input,
    },
    computed: {},
    methods: {},
});
</script>

<style scoped>
</style>