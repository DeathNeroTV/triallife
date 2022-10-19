<template>
    <div class="wrapper stack split-center">
        <span class="split split-center fill-full-width center pt-2 pb-2 text-lg-h5 outlined">{{ title }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ComponentName as PageName } from '../Admin.vue';

import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Input from '@components/Input.vue';

const ComponentName = 'Options';
export default defineComponent({
    name: ComponentName,
    props: {
        title: String,
        list: Array,
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

<style scoped>
</style>