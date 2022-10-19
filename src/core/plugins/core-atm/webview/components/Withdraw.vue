<template>
    <div class="wrapper stack split-center">
        <Input
            :label="'Betrag: ' + getCash"
            :stack="true"
            :onInput="(text) => inputChange(text)"
            :validateCallback="(valid) => setValidityProp('withdraw', valid)"
            :value="''"
            :numberOnly="true"
            :rules="[
                (value) => {
                    return value >= 0.01 ? null : 'Mindestbetrag ist $0.01';
                },
                (value) => {
                    return value <= bank.amount ? null : 'Nicht genug Geld auf dem Konto';
                },
            ]"
            class="fill-full-width mt-2 mb-2"
            placeholder="Betrag"
        />
        <template v-if="validity.withdraw">
            <Button class="fill-full-width" :color="color" @click="action">
                Auszahlen
            </Button>
        </template>
        <template v-else>
            <Button class="fill-full-width" color="grey" :disable="true">
                Auszahlen
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

const ComponentName = 'Withdraw';
export default defineComponent({
    name: ComponentName,
    props: {
        color: String,
        bank: Object,
    },
    data() {
        return {
            value: 0,
            validity: {
                withdraw: false,
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
            if (!this.validity.withdraw) return;
            if (!('alt' in window)) return;
            alt.emit(`${PageName}:Withdraw`, this.value, this.bank.iban);
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
