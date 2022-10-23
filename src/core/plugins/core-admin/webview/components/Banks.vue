<template>
    <div class="wrapper split-center">
        <Modal v-if="showModify">
            <Frame minWidth="30vw" maxWidth="30vw" maxHeight="50vh" :scrollable="true">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">
                        <span class="green--text text--darken-2">Bankdaten</span>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="split-center fill-full-width mb-2">
                        <Input class="mb-2" label="ID" :stack="true" :readonly="true" :value="selected._id"></Input>
                        <Input class="mb-2" label="Iban" :stack="true" :readonly="true" :value="selected.iban"></Input>
                        <Choice
                            v-if="selected.name"
                            class="mb-2"
                            :stack="true"
                            label="Kontoart festlegen"
                            :options="[
                                { text: 'Pacific Standard Bank', value: 'Pacific Standard Bank' },
                                { text: 'Maze Bank', value: 'Maze Bank' },
                                { text: 'Fleeca Bank', value: 'Fleeca Bank' },
                            ]"
                            :value="selected.type"
                            :onInput="(text) => (selected.name = text)"
                        ></Choice>
                        <Choice
                            v-if="selected.type"
                            class="mb-2"
                            :stack="true"
                            label="Kontoart festlegen"
                            :options="[
                                { text: 'Privates Konto', value: 'private' },
                                { text: 'Firmenkonto', value: 'concern' },
                                { text: 'Kreditkonto', value: 'credit' },
                            ]"
                            :value="selected.type"
                            :onInput="(text) => (selected.type = text)"
                        ></Choice>
                        <Input
                            v-if="selected.amount && selected.amount > -1"
                            class="mb-2"
                            label="Betrag"
                            :stack="true"
                            :value="selected.amount"
                            :onInput="(text) => changeInput('amount', parseFloat(text))"
                        ></Input>
                        <Input v-if="selected.owner" class="mb-2" label="Inhaber" :stack="true" :value="selected.owner" :onInput="(text) => changeInput('owner', text)"></Input>
                        <Button class="mb-2" :glow="true" color="red" @click="clearLogs">Kontoauszüge löschen</Button>
                    </div>
                    <div class="split split-full">
                        <Button class="fill-full-width mr-2" color="green" @click="acceptModify">
                            <Icon icon="icon-check-square-o" :size="36"></Icon>
                        </Button>
                        <Button class="fill-full-width ml-2" color="red" @click="hideModify">
                            <Icon icon="icon-times-rectangle-o" :size="36"></Icon>
                        </Button>
                    </div>
                </template>
            </Frame>
        </Modal>
        <Modal v-if="showDelete">
            <Frame minWidth="30vw" maxWidth="30vw" maxHeight="50vh" :scrollable="true">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">
                        <span class="green--text text--darken-2">{{ selected.iban }}</span>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="overline mb-2 mt-2 center red--text">Wollen sie das Konto wirklich löschen?</div>
                    <div class="split split-full mt-5">
                        <Button color="green" @click="acceptDelete">
                            <Icon icon="icon-check-square-o" :size="24"></Icon>
                        </Button>
                        <div class="ml-5 mr-5"></div>
                        <Button color="red" @click="hideDelete">
                            <Icon icon="icon-times-rectangle-o" :size="24"></Icon>
                        </Button>
                    </div>
                </template>
            </Frame>
        </Modal>
        <div class="split split-center fill-full-width pt-2 pb-2 mb-2 outlined">
            <span class="split split-center fill-full-width center pt-2 pb-2 text-lg-h5">{{ title }}</span>
            <Button class="mr-2" color="green" :glow="true" :raise="true" @click="toggleDialog('showModify', { name: ' ', type: ' ' })">
                <Icon icon="icon-add" :size="24"></Icon>
            </Button>
        </div>
        <div class="list">
            <table class="fill-full-width">
                <thead class="grey darken-4" style="text-align: center">
                    <tr>
                        <th class="pl-5 pr-5 pt-2 pb-2" v-for="key of Object.keys(bank).filter((x) => !Array.isArray(bank[x]) && typeof bank[x] !== 'object')">
                            {{ key.toUpperCase() }}
                        </th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(info, index) in list" :class="'grey ' + (index % 2 === 0 ? 'darken-2' : 'darken-3')" style="text-align: center">
                        <td v-for="key of Object.keys(bank).filter((x) => !Array.isArray(bank[x]) && typeof bank[x] !== 'object')">
                            <template v-if="info[key]">
                                {{ getCorrectValue(info[key]) }}
                            </template>
                            <template v-else>&nbsp;</template>
                        </td>
                        <td class="split split-center ma-1">
                            <Button class="fill-full-width" color="green" :glow="true" :raise="true" @click="toggleDialog('showModify', info)">
                                <Icon icon="icon-edit" :size="12"></Icon>
                            </Button>
                            <Button class="fill-full-width ml-1" color="green" :glow="true" :raise="true" @click="toggleDialog('showDelete', info)">
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
import config from '../utility/example-data';

import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Input from '@components/Input.vue';
import Choice from '@components/Choice.vue';
import Module from '@components/Module.vue';
import Modal from '@components/Modal.vue';
import Toolbar from '@components/Toolbar.vue';
import Frame from '@components/Frame.vue';

const ComponentName = 'Banks';
export default defineComponent({
    name: ComponentName,
    props: {
        title: String,
        list: Array,
    },
    data() {
        return {
            showDelete: false,
            showModify: false,
            selected: {},
            bank: config.defaultBank,
        };
    },
    components: {
        Button,
        Icon,
        Input,
        Module,
        Modal,
        Toolbar,
        Frame,
        Choice,
    },
    computed: {},
    methods: {
        getCorrectValue(value: any) {
            if (typeof value === 'number') {
                var parts = value.toFixed(2).split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                return parts.join(',');
            } else if (typeof value === 'boolean') return value ? 'Ja' : 'Nein';
            else return value.toString();
        },
        toggleDialog(key: string, data: Object) {
            this.selected = Object.assign({}, data);
            this[key] = true;
        },
        acceptModify() {
            if (!('alt' in window)) console.log(`banks-modify: ${JSON.stringify(this.selected)}`);
            else alt.emit(`${PageName}:Modify`, 'banks', this.selected._id, JSON.stringify(this.selected));
            this.hideModify();
        },
        hideModify() {
            this.selected = Object.assign({}, {});
            this.showModify = false;
        },
        acceptDelete() {
            if (!('alt' in window)) console.log(`banks-delete: `, this.selected._id);
            else alt.emit(`${PageName}:Remove`, 'banks', this.selected._id);
            this.hideDelete();
        },
        hideDelete() {
            this.selected = Object.assign({}, {});
            this.showDelete = false;
        },
        changeInput(keys: any | any[], value: any) {
            if (Array.isArray(keys)) {
                if (keys.length === 2) this.selected[keys[0]][keys[1]] = value;
                else if (keys.length === 3) this.selected[keys[0]][keys[1]][keys[2]] = value;
                else if (keys.length === 4) this.selected[keys[0]][keys[1]][keys[2]][keys[3]] = value;
            } else this.selected[keys] = value;
        },
        clearLogs() {
            if (!('alt' in window)) this.selected.logs = [];
            else alt.emit(`${PageName}:ClearLogs`, this.selected._id);
        },
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
