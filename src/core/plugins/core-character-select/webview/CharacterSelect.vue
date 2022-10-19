<template>
    <div class="container">
        <Modal v-if="deleteDialog">
            <Frame minWidth="30vw" maxWidth="30vw">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">
                        <span class="red--text">Löschvorgang</span>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="overline mb-8 mt-8 center">Wollen sie diesen Charakter endgültig löschen?</div>
                    <div class="overline mb-8 mt-8 center blue--text">
                        {{ characters[characterIndex].name }}
                    </div>
                    <div class="split split-full">
                        <Button class="mt-2 fill-half-width" color="red" @click="hideDeleteInterface">
                            <Icon icon="icon-times-circle-o" :size="36"></Icon>
                        </Button>
                        <Button class="ml-4 mt-2 fill-half-width" color="green" @click="deleteCharacter">
                            <Icon icon="icon-check-circle-o" :size="36"></Icon>
                        </Button>
                    </div>
                </template>
            </Frame>
        </Modal>
        <div class="stats">
            <!-- Top Buttons -->
            <div class="split split-center fill-full-width" style="box-sizing: border-box">
                <div class="grey--text" style="font-size: 24px; width: 100%; text-align: center !important">
                    {{ getName }}
                </div>
                <Button color="grey" class="mr-2" @click="decrementIndex">
                    <Icon class="grey--text" :size="24" icon="icon-chevron-left" />
                </Button>
                <Button color="blue" class="mr-2" @click="newCharacter" v-if="characters.length < MAX_CHARACTERS">
                    <Icon class="blue--text" :size="24" icon="icon-plus" />
                </Button>
                <Button color="green" class="mr-2" @click="selectCharacter">
                    <Icon class="green--text" :size="24" icon="icon-checkmark" />
                </Button>
                <Button color="red" class="mr-2" @click="showDeleteInterface">
                    <Icon class="red--text" :size="24" icon="icon-delete" />
                </Button>
                <Button color="grey" @click="incrementIndex">
                    <Icon class="grey--text" :size="24" icon="icon-chevron-right" />
                </Button>
            </div>
            <!-- Stats -->
            <div class="stat-wrapper pa-5 split center" style="width: 100%; box-sizing: border-box !important;">
                <div class="stat split">
                    <div class="stat split split-center mr-5">
                        <span class="stat-text overline grey--text">Bargeld:</span>
                        <span class="stat-text overline green--text"> {{ getCash }} $</span>
                    </div>
                    <div class="stat split split-center mr-5">
                        <span class="stat-text overline grey--text">Spielzeit:</span>
                        <span class="stat-text overline green--text"> {{ getHours }} Stunden</span>
                    </div>
                    <div class="stat split split-center mr-5">
                        <span class="stat-text overline grey--text">Gebannt:</span>
                        <span class="stat-text overline green--text"> {{ getBan }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { EXAMPLE_CHARACTER } from './utility/exampleCharacter';
import { CHARACTER_SELECT_WEBVIEW_EVENTS } from '../shared/events';
import { CHARACTER_SELECT_LOCALE } from '../shared/locale';

import { CHARACTER_SELECT_CONFIG } from '../shared/config';

const ComponentName = 'CharacterSelect';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Modal: defineAsyncComponent(() => import('@components/Modal.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
    },
    data() {
        return {
            MAX_CHARACTERS: 3,
            characterIndex: 0,
            characters: [],
            statNames: [],
            deleteDialog: false,
            locales: CHARACTER_SELECT_LOCALE,
        };
    },
    computed: {
        getTotalCharacters() {
            return this.characters.length;
        },
        getName() {
            if (!this.characters[this.characterIndex]) return 'Unbekannt';
            return this.characters[this.characterIndex].name.replace(/_/g, ' ');
        },
        getHours() {
            if (!this.characters[this.characterIndex]) return '0,00';
            return this.characters[this.characterIndex].hours.toFixed(2).replace('.', ',');
        },
        getCash() {
            if (!this.characters[this.characterIndex]) return '0,00';
            if (!this.characters[this.characterIndex].cash) return '0,00';
            var path = this.characters[this.characterIndex].cash.toFixed(2).split('.');
            path[0] = path[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return path.join(',');
        },
        getBan() {
            if (!this.characters[this.characterIndex]) return 'Unbekannt';
            if (!this.characters[this.characterIndex].banned) return 'Unbekannt';
            if (!this.characters[this.characterIndex].banned.state) return 'Nein';
            return this.characters[this.characterIndex].banned.reason;
        },
    },
    methods: {
        setCharacters(characters) {
            this.characterIndex = 0;
            this.characters = characters;
            this.updateAppearance();
        },
        incrementIndex() {
            this.characterIndex += 1;
            if (this.characterIndex > this.characters.length - 1) this.characterIndex = 0;
            this.updateAppearance();
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        decrementIndex() {
            this.characterIndex -= 1;
            if (this.characterIndex <= -1) this.characterIndex = this.characters.length - 1;
            this.updateAppearance();
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        updateAppearance() {
            if (!('alt' in window)) return;
            alt.emit(CHARACTER_SELECT_WEBVIEW_EVENTS.UPDATE, this.characterIndex);
        },
        selectCharacter() {
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit(CHARACTER_SELECT_WEBVIEW_EVENTS.SELECT, this.characters[this.characterIndex]._id);
        },
        newCharacter() {
            if (!('alt' in window)) return;
            alt.emit(CHARACTER_SELECT_WEBVIEW_EVENTS.NEW);
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        showDeleteInterface() {
            this.deleteDialog = true;
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        hideDeleteInterface() {
            this.deleteDialog = false;
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        deleteCharacter() {
            this.deleteDialog = false;
            if (!('alt' in window)) return;
            alt.emit(CHARACTER_SELECT_WEBVIEW_EVENTS.DELETE, this.characters[this.characterIndex]._id);
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        setLocales(localeObject) {
            this.locales = localeObject;
            this.updateLocales(true);
        },
        updateLocales(skipDefault = false) {
            this.statNames = [
                /* Name of the stat, variable name inside character object */
                { varName: this.locales.LABEL_NAME, varRef: 'name' },
                { varName: this.locales.LABEL_AGE, varRef: 'age', useInfo: true },
                { varName: this.locales.LABEL_GENDER, varRef: 'gender', useInfo: true },
                { varName: this.locales.LABEL_HOURS, varRef: 'hours' },
                { varName: this.locales.LABEL_CASH, varRef: 'cash', prefix: '$' },
                { varName: this.locales.LABEL_BANK, varRef: 'bank', prefix: '$' },
            ];
        },
    },
    mounted() {
        if ('alt' in window) {
            this.MAX_CHARACTERS = CHARACTER_SELECT_CONFIG.MAX_CHARACTERS;
            alt.on(CHARACTER_SELECT_WEBVIEW_EVENTS.SET_CHARACTERS, this.setCharacters);
            alt.emit(`${ComponentName}:Ready`);
        } else {
            this.characters = [
                {
                    ...EXAMPLE_CHARACTER,
                },
            ];
        }

        this.updateLocales();
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(CHARACTER_SELECT_WEBVIEW_EVENTS.SET_CHARACTERS, this.setCharacters);
        }
    },
});
</script>

<style scoped>
.container {
    display: block;
    position: absolute;
    /* background: black; */
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 1), transparent 25%);
}

.stats {
    position: fixed;
    display: flex !important;
    flex-direction: column;
    justify-items: flex-start !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    align-content: flex-start !important;
    background: rgba(18, 18, 18, 1);
    box-sizing: border-box;
    min-width: 100vw;
    max-width: 100vw;
    overflow: hidden;
    top: 0;
    left: 0;
    border: 5px solid rgba(128, 128, 128, 0);
    background: url('../../../../../src-webviews/public/assets/images/bg.png');
}

.stat {
    box-sizing: border-box;
}

.stat-text {
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 2px;
    font-size: 2vh !important;
}

.stat-wrapper {
    margin-top: 1vh;
    display: grid;
    grid-auto-columns: auto;
    grid-gap: 5px;
    border-top: 1px solid rgba(128, 128, 128, 1);
}
</style>
