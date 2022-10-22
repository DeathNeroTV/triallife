<template>
    <div class="wrapper split-center">
        <Modal v-if="showModify">
            <Frame minWidth="30vw" maxWidth="30vw" maxHeight="50vh" :scrollable="true">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">
                        <span class="green--text text--darken-2">Firmendaten</span>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="split-center fill-full-width mb-2">
                        <Input v-if="selected._id" class="mb-2" label="ID" :stack="true" :readonly="true" :value="selected._id"></Input>
                        <Input v-if="selected.name" class="mb-2" label="Name" :stack="true" :value="selected.name" :onInput="(text) => changeInput('name', text)"></Input>
                        <Input
                            v-if="selected.bank > -1"
                            class="mb-2"
                            label="Tresor"
                            :stack="true"
                            :value="selected.bank"
                            :onInput="(text) => changeInput('bank', parseFloat(text))"
                        ></Input>
                        <Choice
                            v-if="selected.canDisband"
                            class="mb-2"
                            label="Löschbar"
                            :options="[
                                { text: 'Ja', value: true },
                                { text: 'Nein', value: false },
                            ]"
                            :stack="true"
                            :value="selected.canDisband"
                            :onInput="(text) => changeInput('canDisband', text as boolean)"
                        ></Choice>
                        <Input v-if="selected.type" class="mb-2" label="Typ" :stack="true" :value="selected.type" :onInput="(text) => changeInput('type', text)"></Input>
                        <Module v-if="selected.settings" name="Einstellungen" class="split-center mb-2">
                            <div class="split fill-full-width mb-2">
                                <Input
                                    class="fill-full-width mr-2"
                                    label="Position"
                                    :stack="true"
                                    :readonly="true"
                                    :value="JSON.stringify(selected.settings.position)"
                                    :onInput="(text) => changeInput(['settings', 'position'], JSON.parse(text))"
                                ></Input>
                                <Button :glow="true" :raise="true" @click="selectPosAndRot(['settings', 'position'])">
                                    <Icon icon="icon-map-marker" :size="24"></Icon>
                                </Button>
                            </div>
                            <Module v-if="selected.settings.parkingSpots" name="Parkplätze" class="split-center mb-2">
                                <Module :name="'Parkplatz ' + index" v-for="index in selected.settings.parkingSpots.length" class="mb-2">
                                    <div class="split split-center fill-full-width mb-2">
                                        <Input
                                            class="fill-full-width mr-2"
                                            label="Position"
                                            :stack="true"
                                            :readonly="true"
                                            :value="JSON.stringify(selected.settings.parkingSpots[index - 1].pos)"
                                        ></Input>
                                        <Button :glow="true" :raise="true" @click="selectPosAndRot(['settings', 'parkingSpots', index - 1, 'pos'])">
                                            <Icon icon="icon-map-marker" :size="24"></Icon>
                                        </Button>
                                    </div>
                                    <div class="split split-center fill-full-width">
                                        <Input
                                            class="fill-full-width mr-2"
                                            label="Rotation"
                                            :stack="true"
                                            :readonly="true"
                                            :value="JSON.stringify(selected.settings.parkingSpots[index - 1].rot)"
                                        ></Input>
                                        <Button :glow="true" :raise="true" @click="selectPosAndRot(['settings', 'parkingSpots', index - 1, 'rot'])">
                                            <Icon icon="icon-map-marker" :size="24"></Icon>
                                        </Button>
                                    </div>
                                    <Button :glow="true" :raise="true" @click="removeInput(['settings', 'parkingSpots'], index)">
                                        <Icon icon="icon-minus" :size="24"></Icon>
                                    </Button>
                                </Module>
                                <div class="split split-center fill-full-width">
                                    <div class="fill-full-width mr-2">Parkplatz hinzufügen</div>
                                    <Button :glow="true" :raise="true" @click="addInput(['settings', 'parkingSpots'], { pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0 } })">
                                        <Icon icon="icon-add" :size="24"></Icon>
                                    </Button>
                                </div>
                            </Module>
                            <Module v-if="selected.settings.vehicles" name="Fahrzeuge" class="split-center mb-2">
                                <Module :name="'Fahrzeug ' + index" v-for="index in selected.settings.vehicles.length" class="mb-2">
                                    <div class="split split-center fill-full-width">
                                        <Input
                                            class="fill-full-width mr-2"
                                            label="Model"
                                            :stack="true"
                                            :readonly="false"
                                            :value="selected.settings.vehicles[index - 1].model"
                                            :onInput="(text) => changeInput(['settings', 'vehicles', 'model'], text)"
                                        ></Input>
                                        <Input
                                            class="fill-full-width mr-2"
                                            label="Preis"
                                            :stack="true"
                                            :readonly="false"
                                            :value="selected.settings.vehicles[index - 1].price"
                                            :onInput="(text) => changeInput(['settings', 'vehicles', 'price'], parseFloat(text))"
                                        ></Input>
                                        <Button :glow="true" :raise="true" @click="removeInput(['settings', 'vehicles'], index)">
                                            <Icon icon="icon-minus" :size="24"></Icon>
                                        </Button>
                                    </div>
                                </Module>
                                <div class="split split-center fill-full-width">
                                    <div class="fill-full-width mr-2 mb-2">Fahrzeug hinzufügen</div>
                                    <Button :glow="true" :raise="true" @click="addInput(['settings', 'vehicles'], { model: 'unknown', price: 0.0 })">
                                        <Icon icon="icon-add" :size="24"></Icon>
                                    </Button>
                                </div>
                            </Module>
                            <Input
                                class="mb-2"
                                label="Maximale Fahrzeuganzahl"
                                :stack="true"
                                :value="selected.settings.maxVehicles"
                                :onInput="(text) => changeInput(['settings', 'maxVehicles'], parseInt(text))"
                            ></Input>
                            <Module name="Logo der Firma" class="mb-2">
                                <Input
                                    class="mb-2"
                                    label="Bild"
                                    :stack="true"
                                    :value="selected.settings.blip"
                                    :onInput="(text) => changeInput(['settings', 'blip'], parseInt(text))"
                                ></Input>
                                <Input
                                    class="mb-2"
                                    label="Farbe"
                                    :stack="true"
                                    :value="selected.settings.blipColor"
                                    :onInput="(text) => changeInput(['settings', 'blipColor'], parseInt(text))"
                                ></Input>
                            </Module>
                            <Input
                                class="mb-2"
                                label="Nachricht des Tages"
                                :stack="true"
                                :value="selected.settings.motd"
                                :onInput="(text) => changeInput(['settings', 'motd'], text)"
                            ></Input>
                        </Module>
                        <Module v-if="selected.members" name="Mitglieder" class="split-center mb-2">
                            <Module v-if="selected.members[key]" class="split split-full fill-full-width mb-2" :name="key" v-for="(key, index) in Object.keys(selected.members)">
                                <Input v-if="selected.members[key].name" class="mb-2" :readonly="true" label="Name" :stack="true" :value="selected.members[key].name"></Input>
                                <Input v-if="selected.members[key].rank" class="mb-2" :readonly="true" label="Rang" :stack="true" :value="selected.members[key].rank"></Input>
                                <Choice
                                    v-if="selected.members[key].hasOwnership"
                                    class="mb-2"
                                    label="Inhaber der Firma"
                                    :options="[
                                        { text: 'Ja', value: true },
                                        { text: 'Nein', value: false },
                                    ]"
                                    :stack="true"
                                    :value="selected.members[key].hasOwnership"
                                    :onInput="(text) => changeInput(['members', key, 'hasOwnership'], text as boolean)"
                                ></Choice>
                            </Module>
                        </Module>
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
                    <div class="overline mb-2 mt-2 center red--text">Wollen sie die Firma wirklich löschen?</div>
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
            <Button class="mr-2" color="green" :glow="true" :raise="true" @click="toggleDialog('showModify', { name: 'Name der Firma...', type: 'state, neutral oder gang...' })">
                <Icon icon="icon-add" :size="24"></Icon>
            </Button>
        </div>
        <div class="list">
            <table class="fill-full-width">
                <thead class="grey darken-4" style="text-align: center">
                    <tr>
                        <th class="pl-5 pr-5 pt-2 pb-2" v-for="(key, index) in Object.keys(faction)">
                            {{ key.toUpperCase() }}
                        </th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(concern, index) in list" :class="'grey ' + (index % 2 === 0 ? 'darken-2' : 'darken-3')" style="text-align: center">
                        <td v-for="(key, idx) in Object.keys(faction)">
                            <template v-if="concern[key]">
                                {{ getCorrectValue(key, concern[key]) }}
                            </template>
                            <template v-else>&nbsp;</template>
                        </td>
                        <td class="split split-center ma-1">
                            <Button class="fill-full-width" color="green" :glow="true" :raise="true" @click="toggleDialog('showModify', concern)">
                                <Icon icon="icon-edit" :size="12"></Icon>
                            </Button>
                            <Button class="fill-full-width ml-1" color="green" :glow="true" :raise="true" @click="toggleDialog('showDelete', concern)">
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

const ComponentName = 'Factions';
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
            faction: config.defaultFaction,
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
    computed: {
        getModifiedData() {
            return Object.assign({}, { name: this.faction.name, type: this.faction.type });
        },
    },
    methods: {
        getCorrectValue(key: string, value: any) {
            if (key === 'bank') {
                var parts = value.toFixed(2).split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                return parts.join(',');
            } else if (typeof value === 'object' || Array.isArray(value)) return typeof value;
            else return value;
        },
        toggleDialog(key: string, data: Object) {
            this.selected = Object.assign({}, data);
            this[key] = true;
        },
        acceptModify() {
            if (!('alt' in window)) console.log(`factions-modify: ${JSON.stringify(this.selected)}`);
            else alt.emit(`${PageName}:Modify`, 'factions', this.selected._id, this.selected);
            this.hideModify();
        },
        hideModify() {
            this.selected = Object.assign({}, {});
            this.showModify = false;
        },
        acceptDelete() {
            if (!('alt' in window)) console.log(`factions-delete: `, this.selected._id.toString());
            else alt.emit(`${PageName}:Remove`, 'factions', this.selected._id.toString());
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
                    else delete this.selected[keys[0]][keys[1]];
                } else if (keys.length === 3) {
                    if (Array.isArray(this.selected[keys[0]][keys[1]][keys[2]])) this.selected[keys[0]][keys[1]][keys[2]].splice(value, 1);
                    else delete this.selected[keys[0]][keys[1]][keys[2]];
                } else if (keys.length === 4) {
                    if (Array.isArray(this.selected[keys[0]][keys[1]][keys[2]][keys[3]])) this.selected[keys[0]][keys[1]][keys[2]][keys[3]].splice(value, 1);
                    else delete this.selected[keys[0]][keys[1]][keys[2]][keys[3]];
                }
            } else {
                if (Array.isArray(this.selected[keys])) this.selected[keys].splice(value, 1);
                else delete this.selected[keys];
            }
        },
        selectPosAndRot(keys: any | any[]) {
            if (!('alt' in window)) return;
            alt.emit(`${PageName}:Position`, keys);
        },
        updatePosRot(keys: any | any[], pos: Object, rot: Object) {
            if (Array.isArray(keys)) {
                if (keys.length === 2) {
                    if (this.isPosition(keys[1])) this.selected[keys[0]][keys[1]] = pos;
                    else if (this.isRotation(keys[1])) this.selected[keys[0]][keys[1]] = rot;
                } else if (keys.length === 3) {
                    if (this.isPosition(keys[2])) this.selected[keys[0]][keys[1]][keys[2]] = pos;
                    else if (this.isRotation(keys[2])) this.selected[keys[0]][keys[1]][keys[2]] = rot;
                } else if (keys.length === 4) {
                    if (this.isPosition(keys[3])) this.selected[keys[0]][keys[1]][keys[2]][keys[3]] = pos;
                    else if (this.isRotation(keys[3])) this.selected[keys[0]][keys[1]][keys[2]][keys[3]] = rot;
                }
            } else {
                if (this.isPosition(keys)) this.selected[keys] = pos;
                else if (this.isRotation(keys)) this.selected[keys] = rot;
            }
        },
        isPosition(key: string) {
            const vectorList: Array<string> = ['pos', 'position', 'outside', 'inside'];
            return vectorList.findIndex((x) => x === key) !== -1;
        },
        isRotation(key: string) {
            const vectorList: Array<string> = ['rot', 'rotation'];
            return vectorList.findIndex((x) => x === key) !== -1;
        },
        getCashFixed(amount: number) {
            var parts = amount.toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return parts.join(',');
        },
    },
    mounted() {
        if (!('alt' in window)) return;
        alt.on(`${PageName}:Position`, this.updatePosRot);
    },
    unmounted() {
        if (!('alt' in window)) return;
        alt.off(`${PageName}:Position`, this.updatePosRot);
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
