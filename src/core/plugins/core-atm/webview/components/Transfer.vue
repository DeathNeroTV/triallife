<template>
    <div class="wrapper stack split-center">
        <Input
            :label="'Betrag: ' + getCash"
            :stack="true"
            :onInput="(text) => inputChange(text)"
            :validateCallback="(valid) => setValidityProp('transfer', valid)"
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
            placeholder="Betrag"
            class="fill-full-width mb-2"
        />
        <Input
            :label="'Empfänger: ' + id"
            :stack="true"
            :onInput="(text) => idChange(text)"
            :validateCallback="(valid) => setValidityProp('id', valid)"
            :value="''"
            :numberOnly="false"
            :rules="[
                (value) => {
                    return value.length === 22 ? null : 'Die IBAN muss eine länge von 22 Satzzeichen, mit 5 Leerzeichen aller 4 Stellen haben';
                },
                (value) => {
                    return value.startsWith('LS') ? null : 'Die IBAN begint mit LS am Anfang';
                },
                (value) => {
                    return value !== null && value !== undefined ? null : 'Bitte gebe eine gültige IBAN an';
                },
            ]"
            class="fill-full-width mb-2"
            placeholder="Empfänger (IBAN)"
        />
        <template v-if="validity.transfer && validity.id">
            <Button class="fill-full-width" :color="color" @click="action">
                Überweisen
            </Button>
        </template>
        <template v-else>
            <Button class="fill-full-width" color="grey" :disable="true">
                Überweisen
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

const ComponentName = 'Transfer';
export default defineComponent({
    name: ComponentName,
    props: {
        color: String,
        bank: Object,
    },
    data() {
        return {
            id: '',
            value: 0,
            validity: {
                id: false,
                transfer: false,
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
            if (!this.validity.transfer || !this.validity.id) return;
            if (!('alt' in window)) return;
            alt.emit(`${PageName}:Transfer`, this.value, this.bank.iban, this.id);
        },
        idChange(text: string) {
            this.id = [...text]
                .map((d, i) => (i % 4 === 0 ? ` ${d}` : d))
                .join('')
                .trim();
        },
        inputChange(text: number): void {
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
