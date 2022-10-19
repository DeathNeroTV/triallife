<template>      
    <Modal v-if="showBan">
        <Frame minWidth="30vw" maxWidth="30vw">
            <template v-slot:toolbar>
                <Toolbar :hideExit="true">
                    <span class="green--text text--darken-2">Spielersperrung</span>
                </Toolbar>
            </template>
            <template v-slot:content>
                <div class="overline mb-2 mt-2 center">Wollen sie diesen Charakter bannen?</div>
                <div class="overline mb-2 mt-2 center orange--text">
                    {{ characters.find(x => x.character_id === bannedID).name.replace('_', ' ') }}
                </div>
                <Input 
                    label="Begründung" 
                    :stack="true" 
                    :onInput="text => inputChange('bannedReason', text)"
                    :value="''"
                    :validateCallback="(valid) => setValidityProp('bannedReason', valid)"
                    :rules="[
                        (text) => new RegExp(/^[a-zA-Z0-9_äÄöÖüÜß]+$/gm).test(text) ? null : 'Die Begründung erlaubt keine Sonderzeichen',
                        (text) => text.length >= 3 ? null : 'Der Grund muss mindestens 3 Satzzeichen enthalten',
                    ]"
                    :swapIconSide="true"
                    :icon="valid?.bannedReason ? 'icon-checkmark' : 'icon-question'"
                    class="mt-2 fill-full-width" 
                ></Input>
                <div class="split center mt-5">
                    <Button color="green" @click="toggleBan(bannedID, true, bannedReason, true)">
                        <Icon icon="icon-check-square-o" :size="36"></Icon>
                    </Button>
                    <div class="ml-5 mr-5"></div>
                    <Button color="red" @click="toggleBan(bannedID, false, '')">
                        <Icon icon="icon-times-rectangle-o" :size="36"></Icon>
                    </Button>
                </div>
            </template>
        </Frame>
    </Modal>  
    <Modal v-if="showDialog">
        <Frame minWidth="30vw" maxWidth="50vw" maxHeight="50vh" :scrollable="true">
            <template v-slot:toolbar>
                <Toolbar :hideExit="true">
                    <span class="green--text text--darken-2">{{ getTitle }}</span>
                </Toolbar>
            </template>
            <template v-slot:content>       
                <div class="overline mb-2 mt-2 center">Wollen sie diesen Datensatz wirklich bearbeiten?</div>         
                <div class="split-full mt-5">
                    <div class="split split-center mt-5" v-for="(key, index) in Object.keys(selectedData)">
                        <Module class="split split-full" :name="key.toUpperCase()" v-if="Array.isArray(selectedData[key])">
                            <template v-for="i in selectedData[key].length">                               
                                <Input class="fill-full-width mb-2" :label="(i-1).toFixed(0)" :placeholder="JSON.stringify(selectedData[key][i-1])" :stack="true" :number-only="false" :onInput="(text) => changeDataByKey(key, text)">
                                </Input>
                            </template>  
                        </Module>
                        <template v-else-if="isVector(key)">
                            <div class="split split-center fill-full-width">
                                <Input class="fill-full-width mr-2" :readonly="true" :label="key.toUpperCase()" :placeholder="JSON.stringify(selectedData[key])" :stack="true" :number-only="false" :onInput="(text) => changeDataByKey(key, text)">
                                </Input>
                                <Button @click="selectPosAndRot(key)">
                                    <Icon icon="icon-map-marker" :size="24"></Icon>
                                </Button>
                            </div>
                        </template>
                        <Module class="split split-full" :name="key.toUpperCase()" v-else-if="typeof selectedData[key] === 'object' && !isVector(key)">
                           <template v-for="(key2, index) in Object.keys(selectedData[key])">                                
                                <Choice class="fill-full-width mb-2" :label="key2.toUpperCase()" :stack="true" :options="[{ text: 'Nein', value: false }, { text: 'Ja', value: true }]" :onInput="(text) => changeDataBySubKey(key, key2, text)" :placeholder="selectedData[key][key2].toString()" v-if="typeof selectedData[key][key2] === 'boolean'">
                                </Choice>
                                <Module class="fill-full-width mb-2" :name="key2.toUpperCase()" v-else-if="Array.isArray(selectedData[key][key2])">   
                                    <template v-for="i in selectedData[key][key2].length">                               
                                        <Input class="fill-full-width mb-2" :label="(i-1).toFixed(0)" :placeholder="JSON.stringify(selectedData[key][key2][i-1])" :stack="true" :number-only="false" :onInput="(text) => changeDataBySubKey(key, key2, text)">
                                        </Input>
                                    </template>  
                                </Module>
                                <div class="split split-center fill-full-width" v-else-if="isVector(key2)">
                                    <Input class="fill-full-width mr-2" :readonly="true" :label="key2.toUpperCase()" :placeholder="JSON.stringify(selectedData[key][key2])" :stack="true" :number-only="false" :onInput="(text) => changeDataBySubKey(key, key2, text)">
                                    </Input>
                                    <Button @click="selectPosAndRot([key, key2])">
                                        <Icon icon="icon-map-marker" :size="24"></Icon>
                                    </Button>
                                </div>
                                <Input class="fill-full-width mb-2" :label="key2.toUpperCase()" :placeholder="JSON.stringify(selectedData[key][key2])" :stack="true" :number-only="false" :onInput="(text) => changeDataBySubKey(key, key2, text)" v-else-if="typeof selectedData[key][key2] === 'object'">
                                </Input>
                                <Input class="fill-full-width mb-2" :label="key2.toUpperCase()" :placeholder="selectedData[key][key2].toString()" :stack="true" :number-only="false" :onInput="(text) => changeDataBySubKey(key, key2, text)" v-else>
                                </Input>
                           </template>
                        </Module>
                        <Choice class="fill-full-width" :label="key.toUpperCase()" :stack="true" :options="[{ text: 'Nein', value: false }, { text: 'Ja', value: true }]" :onInput="(text) => changeDataByKey(key, text)" :placeholder="selectedData[key].toString()" v-else-if="typeof selectedData[key] === 'boolean'">
                        </Choice>
                        <Input class="fill-full-width" :label="key.toUpperCase()" :placeholder="selectedData[key].toString()" :stack="true" :number-only="false" :onInput="(text) => changeDataByKey(key, text)" v-else>
                        </Input>
                    </div>
                </div>
                <div class="split center mt-5">
                    <Button color="green" @click="acceptModify">
                        <Icon icon="icon-check-square-o" :size="36"></Icon>
                    </Button>
                    <div class="ml-5 mr-5"></div>
                    <Button color="red" @click="hideModify">
                        <Icon icon="icon-times-rectangle-o" :size="36"></Icon>
                    </Button>
                </div>
            </template>
        </Frame>
    </Modal>
    <Modal v-if="showDelete">
        <Frame minWidth="30vw" maxWidth="30vw">
            <template v-slot:toolbar>
                <Toolbar :hideExit="true">
                    <span class="green--text text--darken-2">Datensatz löschen</span>
                </Toolbar>
            </template>
            <template v-slot:content>
                <div class="overline mb-2 mt-2 center">Wollen sie diesen Datensatz wirklich löschen?</div>                
                <div class="split center mt-5">
                    <Button color="green" @click="acceptDelete">
                        <Icon icon="icon-check-square-o" :size="36"></Icon>
                    </Button>
                    <div class="ml-5 mr-5"></div>
                    <Button color="red" @click="hideDelete">
                        <Icon icon="icon-times-rectangle-o" :size="36"></Icon>
                    </Button>
                </div>
            </template>
        </Frame>
    </Modal>
    <Frame minWidth="90vw" maxWidth="90vw" minHeight="80vh" maxHeight="80vh" :noPadding="true">
        <template v-slot:toolbar>
            <Toolbar @close-page="relayClosePage" pageName="Admin">Stadtverwaltung</Toolbar>
        </template>
        <template v-slot:content>
            <div class="split split-full">
                <div class="sidebar">
                    <div class="split split-center sidebar-item outlined" v-for="(name, index) in names" @click="selectOption(index)" :key="index">   
                        <Icon :class="(selected === index ? 'green--text' : 'grey--text')" :icon="getIcon(index)" :size="24" style="min-width: 3vw !important;"></Icon>   
                        <span :class="'fill-full-width ' + (selected === index ? 'green--text' : 'grey--text')">{{ getText(index) }}</span>
                    </div>
                </div>
                <component class="split-full ml-2 mr-2 mb-2 container-panel" v-bind:is="getComponent" v-bind:list="getList" v-bind:title="getTitle" @toggle-ban="toggleBan" @modify-data="modifyData" @delete-data="deleteData" />
            </div>
        </template>
    </Frame>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

export const ComponentName = 'Admin';
export default defineComponent({
    name: ComponentName,
    components: {
        Accounts: defineAsyncComponent(() => import('./components/Accounts.vue')),
        Banks: defineAsyncComponent(() => import('./components/Banks.vue')),
        Characters: defineAsyncComponent(() => import('./components/Characters.vue')),
        Dashboard: defineAsyncComponent(() => import('./components/Dashboard.vue')),
        Factions: defineAsyncComponent(() => import('./components/Factions.vue')),
        Interiors: defineAsyncComponent(() => import('./components/Interiors.vue')),
        Items: defineAsyncComponent(() => import('./components/Items.vue')),
        Storage: defineAsyncComponent(() => import('./components/Storage.vue')),
        Stores: defineAsyncComponent(() => import('./components/Stores.vue')),
        Vehicles: defineAsyncComponent(() => import('./components/Vehicles.vue')),
        Options: defineAsyncComponent(() => import('./components/Options.vue')),
        Garages: defineAsyncComponent(() => import('./components/Garages.vue')),

        Choice: defineAsyncComponent(() => import('@components/Choice.vue')),
        RangeInput: defineAsyncComponent(() => import('@components/RangeInput.vue')),
        Input: defineAsyncComponent(() => import('@components/Input.vue')),
        Modal: defineAsyncComponent(() => import('@components/Modal.vue')),
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            bannedReason: '',
            accounts: [],
            banks: [],
            characters: [],
            interiors: [],
            options: [],
            stores: [],
            vehicles: [],
            storage: [],
            garages: [],
            factions: [],
            items: [],
            icons: [
                'icon-dashboard',
                'icon-users',
                'icon-bank',
                'icon-users2',
                'icon-house',
                'icon-settings',
                'icon-store_mall_directory',
                'icon-directions_car',
                'icon-box',
                'icon-local_parking',
                'icon-building',
                'icon-sitemap',
            ],
            translations: [
                'Startseite',
                'Benutzer-Konten',
                'Bank-Konten',
                'Charaktere',
                'Wohnräume',
                'Einstellungen',
                'Geschäfte',
                'Fahrzeuge',
                'Lagerhäuser',
                'Parkhäuser',
                'Firmen',
                'Gegenstände',
            ],
            names: ['Dashboard', 'Accounts', 'Banks', 'Characters', 'Interiors', 'Options', 'Stores', 'Vehicles', 'Storage', 'Garages', 'Factions', 'Items'],
            selected: 0,
            showBan: false,
            showDelete: false,
            showDialog: false,
            selectedTable: '',
            selectedData: {},
            bannedID: 0,
            valid: {
                bannedReason: false,
            },
        };
    },
    methods: {
        updateData({ ...data }) {
            Object.keys(data).forEach((key) => (this[key] = data[key]));
        },
        updatePosRot(keys: string | string[], pos: Object, rot: Object) {
            if (Array.isArray(keys)) {
                if (keys.length === 2) {
                    if (this.isPosition(keys[1])) this.selectedData[keys[0]][keys[1]] = pos;
                    else if (this.isRotation(keys[1])) this.selectedData[keys[0]][keys[1]] = rot;
                } else if (keys.length === 3) {
                    if (this.isPosition(keys[2])) this.selectedData[keys[0]][keys[1]][keys[2]] = pos;
                    else if (this.isRotation(keys[2])) this.selectedData[keys[0]][keys[1]][keys[2]] = rot;
                }
            } else {
                if (this.isPosition(keys)) this.selectedData[keys] = pos;
                else if (this.isRotation(keys)) this.selectedData[keys] = rot;
            }
        },
        handlePress(e) {
            if (e.keyCode !== 27) return;
            if (!('alt' in window)) return;
            alt.emit(`${ComponentName}:Close`);
        },
        relayClosePage() {
            this.$emit('close-page', `${ComponentName}:Close`);
        },
        selectOption(_selected: number) {
            this.selected = _selected;
        },
        getText(index: number) {
            return this.translations[index];
        },
        getIcon(index: number) {
            return this.icons[index];
        },
        inputChange(name: string, text: string): void {
            this[name] = text;
        },
        setValidityProp(name: string, valid: boolean): void {
            this.valid[name] = valid;
        },
        toggleBan(id: number, state: boolean, reason: string, use: boolean = false) {
            if ('alt' in window && use) alt.emit(`${ComponentName}:Ban`, id, false, reason);
            this.showBan = state;
            this.bannedReason = state ? reason : '';
            this.bannedID = state ? id : 0;
        },
        modifyData(database: string, data: Object) {
            this.selectedTable = database;
            this.selectedData = Object.assign({}, data);
            this.showDialog = true;
        },
        acceptModify() {
            const database = this.names[this.selected].toLowerCase();
            if (!('alt' in window)) alert(`${database.toLowerCase()}: ${JSON.stringify(this.selectedData)}`);
            else alt.emit(`${ComponentName}:Modify`, database, this.selectedData);
            this.hideModify();
        },
        hideModify() {
            this.selectedData = Object.assign({}, {});
            this.showDialog = false;
            this.selectedTable = '';
        },
        changeDataByKey(key: string, value: string | boolean | number) {
            const vectorList: Array<string> = ['pos', 'position', 'outside', 'inside', 'rot', 'rotation'];
            if (vectorList.findIndex((x) => x === key) !== -1) this.selectedData[key] = JSON.parse(value as string);
            else this.selectedData[key] = value;
        },
        changeDataBySubKey(key: string, subKey: string, value: string | boolean | number) {
            const vectorList: Array<string> = ['pos', 'position', 'outside', 'inside', 'rot', 'rotation'];
            if (vectorList.findIndex((x) => x === key) !== -1) this.selectedData[key][subKey] = JSON.parse(value as string);
            else this.selectedData[key][subKey] = value;
        },
        selectPosAndRot(keys: string | string[]) {
            if (!('alt' in window)) return;
            alt.emit(`${ComponentName}:Position`, keys);
        },
        deleteData(database: string, data: Object) {
            this.selectedTable = database;
            this.selectedData = Object.assign(this.selectedData, data);
            this.showDelete = true;
        },
        acceptDelete() {
            const database = this.names[this.selected].toLowerCase();
            if (!('alt' in window)) console.log(`deleted data from database ${database.toLowerCase()}: `, this.selectedData._id.toString());
            else alt.emit(`${ComponentName}:Remove`, database, this.selectedData._id);
            this.hideDelete();
        },
        hideDelete() {
            this.selectedData = Object.assign({}, {});
            this.showDelete = false;
            this.selectedTable = '';
        },
        isVector(key: string) {
            const vectorList: Array<string> = ['pos', 'position', 'outside', 'inside', 'rot', 'rotation'];
            return vectorList.findIndex((x) => x === key) !== -1;
        },
        isPosition(key: string) {
            const vectorList: Array<string> = ['pos', 'position', 'outside', 'inside'];
            return vectorList.findIndex((x) => x === key) !== -1;
        },
        isRotation(key: string) {
            const vectorList: Array<string> = ['rot', 'rotation'];
            return vectorList.findIndex((x) => x === key) !== -1;
        },
    },
    computed: {
        getTitle() {
            return this.translations[this.selected];
        },
        getList() {
            if (this.selected === 0) {
                return [
                    { name: 'Benutzeranzahl', amount: this.accounts.length },
                    { name: 'Kontoanzahl', amount: this.banks.length },
                    { name: 'Charakteanzahl', amount: this.characters.length },
                    { name: 'Firmenanzahl', amount: this.factions.length },
                    { name: 'Wohnraumanzahl', amount: this.interiors.length },
                    { name: 'Gegenstandsanzahl', amount: this.items.length },
                    { name: 'Lagerhäuseranzahl', amount: this.storage.length },
                    { name: 'Geschäftsanzahl', amount: this.stores.length },
                    { name: 'Fahrzeuganzahl', amount: this.vehicles.length },
                    { name: 'Parkhäuseranzahl', amount: this.garages.length },
                ];
            }
            const table = this[this.names[this.selected].toLowerCase()];
            return table;
        },
        getComponent() {
            return this.names[this.selected];
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);
        if ('alt' in window) {
            alt.on(`${ComponentName}:Update`, this.updateData);
            alt.on(`${ComponentName}:Position`, this.updatePosRot);
            alt.emit(`${ComponentName}:Ready`);
            alt.emit('ready');
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);
        if ('alt' in window) {
            alt.off(`${ComponentName}:Update`, this.updateData);
            alt.off(`${ComponentName}:Position`, this.updatePosRot);
        }
    },
});
</script>

<style>
.sidebar {
    display: grid;
    grid-template-columns: 100%;
    grid-auto-rows: 5.452562704471101vh;
    grid-gap: 5px;
    min-width: calc(20vw - 2.9761904761904763vw);
    max-width: calc(20vw - 2.9761904761904763vw);
    min-height: calc(80vh);
    max-height: calc(80vh);
    overflow-x: hidden;
    overflow-y: auto;
}

.container-panel {
    min-width: calc(70vw);
    max-width: calc(70vw);
    min-height: calc(80vh);
    max-height: calc(80vh);
    overflow: hidden;
}

.outlined {
    box-shadow: 0 0 10px dimgray inset;
}
</style>
