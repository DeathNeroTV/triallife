<template>
    <div class="wrapper split-center">
        <Modal v-if="showModify">
            <Frame minWidth="30vw" maxWidth="30vw" maxHeight="50vh" :scrollable="true">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">
                        <span class="green--text text--darken-2">Charakterdaten</span>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="split-center fill-full-width mb-2">
                        <Input class="mb-2" label="ID" :stack="true" :readonly="true" :value="selected._id"></Input>
                        <Input class="mb-2" label="Name" :stack="true" :value="selected.name" :onInput="(text) => changeInput('name', text)"></Input>
                        <Input class="mb-2" label="Bargeld" :stack="true" :value="selected.cash" :onInput="(text) => changeInput('cash', parseFloat(text))"></Input>
                        <Input class="mb-2" label="Nahrung" :stack="true" :value="selected.food" :onInput="(text) => changeInput('food', parseFloat(text))"></Input>
                        <Input class="mb-2" label="Hydration" :stack="true" :value="selected.water" :onInput="(text) => changeInput('water', parseFloat(text))"></Input>
                        <Module name="Bannung" class="split-center fill-full-width mb-2">
                            <Input class="mb-2" label="Grund" :stack="true" :value="selected.banned.reason" :onInput="(text) => changeInput(['banned', 'reason'], text)"></Input>
                            <Choice
                                class="mb-2"
                                label="Gebannt?"
                                :options="[
                                    { text: 'Ja', value: true },
                                    { text: 'Nein', value: false },
                                ]"
                                :stack="true"
                                :value="selected.banned.state"
                                :onInput="(text) => changeInput(['banned', 'state'], text as boolean)"
                            ></Choice>
                        </Module>
                        <Choice
                            class="mb-2"
                            label="Ohnmächtig?"
                            :options="[
                                { text: 'Ja', value: true },
                                { text: 'Nein', value: false },
                            ]"
                            :stack="true"
                            :value="selected.isDead"
                            :onInput="(text) => changeInput('isDead', text as boolean)"
                        ></Choice>
                        <Input class="mb-2" label="Gesundheit" :stack="true" :value="selected.health" :onInput="(text) => changeInput('health', parseInt(text))"></Input>
                        <Input class="mb-2" label="Panzerung" :stack="true" :value="selected.armour" :onInput="(text) => changeInput('armour', parseInt(text))"></Input>
                        <Input class="mb-2" label="Spielzeit" :stack="true" :value="selected.hours" :onInput="(text) => changeInput('armour', parseFloat(text))"></Input>
                        <RangeInput
                            class="mb-2"
                            label="Fahndungslevel"
                            :stack="true"
                            :minIndex="0"
                            :maxIndex="6"
                            :indexValue="selected.wanted"
                            :onInput="(text) => changeInput('wanted', parseInt(text))"
                        ></RangeInput>
                        <Input class="mb-2" label="Benutzerkonto ID" :stack="true" :readonly="true" :value="selected.account_id"></Input>
                        <Input class="mb-2" label="Charakter ID" :stack="true" :readonly="true" :value="selected.character_id"></Input>
                        <Input class="mb-2" label="Firmen ID" :stack="true" :readonly="false" :value="selected.faction" :onInput="(text) => changeInput('faction', text)"></Input>
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
                        <span class="green--text text--darken-2">{{ selected.name.toUpperCase() }}</span>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="overline mb-2 mt-2 center red--text">Wollen sie den Charakter wirklich löschen?</div>
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
        </div>
        <div class="list">
            <table class="fill-full-width">
                <thead class="grey darken-4" style="text-align: center">
                    <tr>
                        <th class="pl-5 pr-5 pt-2 pb-2" v-for="key of Object.keys(character).filter((x) => !Array.isArray(character[x]) && typeof character[x] !== 'object')">
                            {{ key.toUpperCase() }}
                        </th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(info, index) in list" :class="'grey ' + (index % 2 === 0 ? 'darken-2' : 'darken-3')" style="text-align: center">
                        <td v-for="key of Object.keys(character).filter((x) => !Array.isArray(character[x]) && typeof character[x] !== 'object')">
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

const ComponentName = 'Characters';
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
            memberID: '',
            rankID: '',
            ownership: false,
            character: config.defaultCharacter,
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
                return parts.join(',') + ' $';
            } else if (typeof value === 'boolean') return value ? 'Ja' : 'Nein';
            else return value.toString();
        },
        toggleDialog(key: string, data: Object) {
            this.selected = Object.assign({}, data);
            this[key] = true;
        },
        acceptModify() {
            if (!('alt' in window)) console.log(`characters-modify: ${JSON.stringify(this.selected)}`);
            else alt.emit(`${PageName}:Modify`, 'characters', this.selected._id, JSON.stringify(this.selected));
            this.hideModify();
        },
        hideModify() {
            this.selected = Object.assign({}, {});
            this.showModify = false;
        },
        acceptDelete() {
            if (!('alt' in window)) console.log(`characters-delete: `, this.selected._id);
            else alt.emit(`${PageName}:Remove`, 'characters', this.selected._id);
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
        addInput(keys: any | any[], value: any) {
            if (Array.isArray(keys)) {
                if (keys.length === 2) {
                    if (Array.isArray(this.selected[keys[0]][keys[1]])) this.selected[keys[0]][keys[1]].push(value);
                    else this.selected[keys[0]][keys[1]] = value;
                } else if (keys.length === 3) {
                    if (Array.isArray(this.selected[keys[0]][keys[1]][keys[2]])) this.selected[keys[0]][keys[1]][keys[2]].push(value);
                    else this.selected[keys[0]][keys[1]][keys[2]] = value;
                } else if (keys.length === 4) {
                    if (Array.isArray(this.selected[keys[0]][keys[1]][keys[2]][keys[3]])) this.selected[keys[0]][keys[1]][keys[2]][keys[3]].push(value);
                    else this.selected[keys[0]][keys[1]][keys[2]][keys[3]] = value;
                }
            } else {
                if (Array.isArray(this.selected[keys])) this.selected[keys].push(value);
                else this.selected[keys] = value;
            }
        },
        removeInput(keys: any | any[], value: any) {
            if (Array.isArray(keys)) {
                if (keys.length === 2) {
                    if (Array.isArray(this.selected[keys[0]][keys[1]])) this.selected[keys[0]][keys[1]].splice(value, 1);
                    else delete this.selected[keys[0]][keys[1]][value];
                } else if (keys.length === 3) {
                    if (Array.isArray(this.selected[keys[0]][keys[1]][keys[2]])) this.selected[keys[0]][keys[1]][keys[2]].splice(value, 1);
                    else delete this.selected[keys[0]][keys[1]][keys[2]][value];
                } else if (keys.length === 4) {
                    if (Array.isArray(this.selected[keys[0]][keys[1]][keys[2]][keys[3]])) this.selected[keys[0]][keys[1]][keys[2]][keys[3]].splice(value, 1);
                    else delete this.selected[keys[0]][keys[1]][keys[2]][keys[3]][value];
                }
            } else {
                if (Array.isArray(this.selected[keys])) this.selected[keys].splice(value, 1);
                else delete this.selected[keys][value];
            }
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
