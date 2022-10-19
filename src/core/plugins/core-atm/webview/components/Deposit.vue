<template>
    <div class="wrapper stack split-center">
        <Input
            :label="'Betrag: ' + getCash"
            :stack="true"
            :onInput="(text) => inputChange(text)"
            :validateCallback="(valid) => setValidityProp('deposit', valid)"
            :value="''"
            :numberOnly="true"
            :rules="[
                (value) => {
                    return value >= 0.01 ? null : 'Mindestbetrag ist $0.01';
                },
                (value) => {
                    return value <= cash ? null : 'Nicht genug Bargeld dabei';
                },
            ]"
            placeholder="Betrag"
            class="fill-full-width mt-2 mb-2"
        />
        <template v-if="validity.deposit">
            <Button class="fill-full-width" :color="color" @click="action">
                Einzahlen
            </Button>
        </template>
        <template v-else>
            <Button class="fill-full-width" color="grey" :disable="true">
                Einzahlen
            </Button>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ComponentName as PageName } from '../Atm.vue';

import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Input from '@components/Input.vue';

const ComponentName = 'Deposit';
export default defineComponent({
    name: ComponentName,
    props: {
        color: String,
        cash: Number,
        bank: Object,
    },
    data() {
        return {
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

<style>
.fill-full-width {
    width: 100%;
}
</style>
