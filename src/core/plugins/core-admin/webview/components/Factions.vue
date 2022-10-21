<template>
    <div class="wrapper split-center">
        <Modal v-if="showModify">
            <Frame minWidth="30vw" maxWidth="30vw" maxHeight="50vh" :scrollable="true">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">
                        <span class="green--text text--darken-2">Firma erstellen oder modifizieren</span>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="split-center fill-full-width">
                        <Input v-if="selected._id" class="mb-2" label="ID" :stack="true" :readonly="true" :value="selected._id"></Input>
                        <Input v-if="selected.name" class="mb-2" label="Name" :stack="true" :placeholder="selected.name" :onInput="(text) => changeInput('name', text)"></Input>
                        <Input
                            v-if="selected.bank"
                            class="mb-2"
                            label="Tresor"
                            :stack="true"
                            :placeholder="selected.bank"
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
                            placeholder="Ist die firma löschbar?"
                            :onInput="(text) => changeInput('canDisband', text as boolean)"
                        ></Choice>
                        <Input v-if="selected.type" class="mb-2" label="Typ" :stack="true" :placeholder="selected.type" :onInput="(text) => changeInput('type', text)"></Input>
                        <Module v-if="selected.settings" name="Einstellungen" class="split-center mb-2">
                            <div v-if="selected.settings.position" class="split fill-full-width">
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
                                <Module :name="'Parkplatz ' + index + 1" v-for="(parking, index) in selected.settings.parkingSpots">
                                    <div class="split split-center fill-full-width">
                                        <Input class="fill-full-width mr-2" label="Position" :stack="true" :readonly="true" :value="JSON.stringify(parking.pos)"></Input>
                                        <Button :glow="true" :raise="true" @click="selectPosAndRot(['settings', 'parkingSpots', index, 'pos'])">
                                            <Icon icon="icon-map-marker" :size="24"></Icon>
                                        </Button>
                                    </div>
                                    <div class="split split-center fill-full-width">
                                        <Input class="fill-full-width mr-2" label="Rotation" :stack="true" :readonly="true" :value="JSON.stringify(parking.rot)"></Input>
                                        <Button :glow="true" :raise="true" @click="selectPosAndRot(['settings', 'parkingSpots', index, 'rot'])">
                                            <Icon icon="icon-map-marker" :size="24"></Icon>
                                        </Button>
                                    </div>
                                </Module>
                                <div class="split split-center fill-full-width">
                                    <div class="fill-full-width mr-2">Parkplatz hinzufügen</div>
                                    <Button :glow="true" :raise="true" @click="addInput(['settings', 'parkingSpots'], { pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0 } })">
                                        <Icon icon="icon-add" :size="24"></Icon>
                                    </Button>
                                </div>
                            </Module>
                            <Module v-if="selected.settings.vehicles" name="Fahrzeuge" class="split-center mb-2">
                                <Module :name="'Fahrzeug ' + index + 1" v-for="(vehicle, index) in selected.settings.vehicles">
                                    <div class="split split-center fill-full-width">
                                        <Input
                                            class="fill-full-width mr-2"
                                            label="Model"
                                            :stack="true"
                                            :readonly="false"
                                            :value="vehicle.model"
                                            :onInput="(text) => changeInput(['settings', 'vehicles', 'model'], text)"
                                        ></Input>
                                        <Input
                                            class="fill-full-width mr-2"
                                            label="Preis"
                                            :stack="true"
                                            :readonly="false"
                                            :value="vehicle.price"
                                            :onInput="(text) => changeInput(['settings', 'vehicles', 'price'], parseFloat(text))"
                                        ></Input>
                                    </div>
                                </Module>
                                <div class="split split-center fill-full-width">
                                    <div class="fill-full-width mr-2">Fahrzeug hinzufügen</div>
                                    <Button :glow="true" :raise="true" @click="addInput(['settings', 'vehicles'], { model: 'unknown', price: 0.0 })">
                                        <Icon icon="icon-add" :size="24"></Icon>
                                    </Button>
                                </div>
                            </Module>
                            <Input
                                v-if="selected.settings.maxVehicles"
                                class="mb-2"
                                label="Typ"
                                :stack="true"
                                :placeholder="selected.settings.maxVehicles"
                                :onInput="(text) => changeInput(['settings', 'maxVehicles'], parseInt(text))"
                            ></Input>
                            <Module name="Logo der Firma" v-if="selected.settings.blip">
                                <Input
                                    v-if="selected.settings.blip"
                                    class="mb-2"
                                    label="Bild"
                                    :stack="true"
                                    :placeholder="selected.settings.blip"
                                    :onInput="(text) => changeInput(['settings', 'blip'], parseInt(text))"
                                ></Input>
                                <Input
                                    v-if="selected.settings.blipColor"
                                    class="mb-2"
                                    label="Farbe"
                                    :stack="true"
                                    :placeholder="selected.settings.blipColor"
                                    :onInput="(text) => changeInput(['settings', 'blipColor'], parseInt(text))"
                                ></Input>
                                <Input
                                    v-if="selected.settings.motd"
                                    class="mb-2"
                                    label="Nachricht des Tages"
                                    :stack="true"
                                    :placeholder="selected.settings.motd"
                                    :onInput="(text) => changeInput(['settings', 'motd'], text)"
                                ></Input>
                            </Module>
                        </Module>
                    </div>
                    <div class="split split-full mt-5">
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
                        <span class="green--text text--darken-2">Datensatz löschen</span>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="overline mb-2 mt-2 center">Wollen sie die Firma wirklich löschen?</div>
                    <div class="overline mb-2 mt-2 center text--green">{{ selected.name.toUpperCase() }}</div>
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
            } else if (key === '_id') return value.toString();
            else if (typeof value === 'object' || Array.isArray(value)) return JSON.stringify(value);
            else return value;
        },
        toggleDialog(key: string, data: Object) {
            this.selected = Object.assign({}, data);
            this[key] = true;
        },
        acceptModify() {
            if (!('alt' in window)) console.log(`factions-modify: ${JSON.stringify(this.selected)}`);
            else alt.emit(`${PageName}:Modify`, 'factions', this.selected);
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
                if (keys.length === 2) this.selected[keys[0]][keys[1]] = value;
                else if (keys.length === 3) this.selected[keys[0]][keys[1]][keys[2]] = value;
                else if (keys.length === 4) this.selected[keys[0]][keys[1]][keys[2]][keys[3]] = value;
            } else this.selected[keys] = value;
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
