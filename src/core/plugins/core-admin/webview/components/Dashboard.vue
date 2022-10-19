<template>
     <div class="wrapper split-center no-overflow">
        <span class="fill-full-width center pt-2 pb-2 text-lg-h5 mb-2 outlined">{{ title }}</span>
        <div class="list">
            <table class="fill-full-width">
                <thead class="grey darken-4" style="text-align: center">
                    <tr>
                        <th class="pl-5 pr-5 pt-2 pb-2">Name</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Anzahl</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(info, index) in list" :class="'grey ' + (index % 2 === 0 ? 'darken-2' : 'darken-3')" style="text-align: center">
                        <td class="pl-5 pr-5 pt-2 pb-2">{{ info.name }}</td>
                        <td class="pl-5 pr-5 pt-2 pb-2">{{ info.amount }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ComponentName as PageName } from '../Admin.vue';

import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Input from '@components/Input.vue';

const ComponentName = 'Dashboard';
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
.no-overflow {
    overflow: hidden;
}
.list {
    min-width: 100%;
    max-width: 100%;
    min-height: 50%;
    max-height: 50%;
    overflow: auto;
}
</style>