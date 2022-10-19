<template>
    <div class="wrapper split-center no-overflow">
        <div class="split split-center fill-full-width pt-2 pb-2 mb-2 outlined">
            <span class="split split-center fill-full-width center pt-2 pb-2 text-lg-h5">{{ title }}</span>
            <Button class="mr-2" color="green" :glow="true" :raise="true" @click="e => $emit('modify-data', 'garages', this.garage)">
                <Icon icon="icon-add" :size="24"></Icon>
            </Button>
        </div>
        <div class="list">
            <table class="fill-full-width">
                <thead class="grey darken-4" style="text-align: center">
                    <tr>
                        <th class="pl-5 pr-5 pt-2 pb-2" v-for="(key, index) in Object.keys(garage)">
                            {{key.toUpperCase() }}
                        </th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(parkhouse, index) in list" :class="'grey ' + (index % 2 === 0 ? 'darken-2' : 'darken-3')" style="text-align: center">
                        <td v-for="(key, idx) in Object.keys(parkhouse)">
                            {{ typeof parkhouse[key] === 'object' || Array.isArray(parkhouse[key]) ? JSON.stringify(parkhouse[key]) : parkhouse[key].toString() }}
                        </td>
                        <td class="split split-center ma-1">
                            <Button class="fill-full-width" color="green" :glow="true" :raise="true" @click="">
                                <Icon icon="icon-edit" :size="12"></Icon>
                            </Button>
                            <Button class="fill-full-width ml-1" color="green" :glow="true" :raise="true" @click="">
                                <Icon icon="icon-bin" :size="12"></Icon>
                            </Button>
                        </td>-->
                    </tr>
                </tbody>
            </table>
        </div>        
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ComponentName as PageName } from '../Admin.vue';
import config from '../utility/example-data';

import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Input from '@components/Input.vue';

const ComponentName = 'Garages';
export default defineComponent({
    name: ComponentName,
    props: {
        title: String,
        list: Array,
    },
    data() {
        return {
            garage: config.defaultGarage,
            value: 0,
            validity: {
                deposit: false,
            },
        };
    },
    components: {
        Button,
        Icon,
        Input,
    },
    computed: {
        getCash() {
            var parts = this.value.toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `${parts.join(',')} $`;
        },
    },
    methods: {
        action() {
            if (!this.validity.deposit) return;
            if (!('alt' in window)) return;
            alt.emit(`${PageName}:Deposit`, this.value, this.bank.iban);
        },
        inputChange(text: number) {
            if (typeof text === 'string') text = parseFloat(text);
            this.value = text;
        },
        setValidityProp(prop: string, valid: boolean) {
            this.validity[prop] = valid;
        },
    },
});
</script>

<style scoped>
</style>