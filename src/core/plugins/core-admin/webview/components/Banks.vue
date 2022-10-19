<template>
    <div class="wrapper split-center no-overflow">
        <span class="fill-full-width center pt-2 pb-2 text-lg-h5 mb-2 outlined">{{ title }}</span>
        <div class="list">
            <table class="fill-full-width">
                <thead class="grey darken-4" style="text-align: center">
                    <tr>
                        <th class="pl-5 pr-5 pt-2 pb-2">ID</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Bank</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Iban</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Inhaber</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Guthaben</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Kontoart</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(bank, index) in list" :class="'grey ' + (index % 2 === 0 ? 'darken-2' : 'darken-3')" style="text-align: center">
                        <td>{{ bank._id }}</td>
                        <td>{{ bank.name }}</td>
                        <td>{{ bank.iban }}</td>
                        <td>{{ bank.owner }}</td>
                        <td>{{ getCashFixed(bank.amount) }}</td>
                        <td>{{ bank.type.toString().toUpperCase() }}</td>
                        <td class="split split-center ma-1">
                            <Button class="fill-full-width" color="green" :glow="true" :raise="true" @click="">
                                <Icon icon="icon-edit" :size="12"></Icon>
                            </Button>
                            <Button class="fill-full-width ml-1" color="green" :glow="true" :raise="true" @click="">
                                <Icon icon="icon-bin" :size="12"></Icon>
                            </Button>
                        </td>
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

const ComponentName = 'Banks';
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
    methods: {
        getCashFixed(amount: number) {
            var parts = amount.toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return parts.join(',');
        },
    },
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