<template>
    <div class="container">
        <div class="creator stack">
            <div class="navigation split split-full center mt-4 pl-4 pr-4 pb-4 space-between">
                <!-- Navigate Left -->
                <Button color="green" @click="setIndex(0)">
                    <Icon class="green--text" :size="24" icon="icon-groups" />
                </Button>
                <Button color="green" @click="setIndex(1)">
                    <Icon class="green--text" :size="24" icon="icon-ruler" />
                </Button>
                <Button color="green" @click="setIndex(2)">
                    <Icon class="green--text" :size="24" icon="icon-scissors" />
                </Button>
                <Button color="green" @click="setIndex(3)">
                    <Icon class="green--text" :size="24" icon="icon-cracked-mask" />
                </Button>
                <Button color="green" @click="setIndex(4)">
                    <Icon class="green--text" :size="24" icon="icon-pencil" />
                </Button>
                <Button color="green" @click="setIndex(5)">
                    <Icon class="green--text" :size="24" icon="icon-id-card" />
                </Button>
            </div>
            <div class="inner-page pl-4 pt-4 pr-4">
                <component
                    v-bind:is="navOptions[selection]"
                    v-bind:data="data"
                    v-bind:locales="locales"
                    @set-parameter="setParameter"
                    @inc-parameter="incrementParameter"
                    @dec-parameter="decrementParameter"
                    @set-infodata="setInfoData"
                    v-bind:infodata="infoData"
                ></component>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

import MakeupList from './utility/makeupList';
import OverlaysList from './utility/overlaysList';
import { MaleHairOverlays, FemaleHairOverlays } from './utility/hairOverlays';
import { CHARACTER_CREATOR_LOCALE } from '../shared/locale';
import { CHARACTER_CREATOR_WEBVIEW_EVENTS } from '../shared/events';

const ComponentName = 'CharacterCreator';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Modal: defineAsyncComponent(() => import('@components/Modal.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Appearance: defineAsyncComponent(() => import('./components/Appearance.vue')),
        Structure: defineAsyncComponent(() => import('./components/Structure.vue')),
        Hair: defineAsyncComponent(() => import('./components/Hair.vue')),
        Overlays: defineAsyncComponent(() => import('./components/Overlays.vue')),
        Makeup: defineAsyncComponent(() => import('./components/Makeup.vue')),
        Info: defineAsyncComponent(() => import('./components/Info.vue')),
    },
    data() {
        return {
            show: false,
            selection: 0,
            forceUpdate: 0,
            controlsEnabled: true,
            data: {
                sex: 1,
                faceMother: 0,
                faceFather: 0,
                skinMother: 0,
                skinFather: 0,
                skinMix: 0.5,
                faceMix: 0.5,
                structure: new Array(20).fill(0),
                hair: 3,
                hairColor1: 1,
                hairColor2: 5,
                hairOverlay: '',
                facialHair: 29,
                facialHairColor1: 0,
                facialHairOpacity: 0,
                eyebrows: 0,
                eyebrowsOpacity: 1,
                eyebrowsColor1: 0,
                chestHair: 0,
                chestHairOpacity: 0,
                chestHairColor1: 0,
                eyes: 0,
                opacityOverlays: [],
                colorOverlays: [],
            },
            infoData: {
                age: new Date(1990, 1, 1),
                gender: null,
                name: '',
            },
            navOptions: ['Appearance', 'Structure', 'Hair', 'Overlays', 'Makeup', 'Info'],
            totalCharacters: 1,
            locales: CHARACTER_CREATOR_LOCALE,
        };
    },
    computed: {},
    methods: {
        setIndex(index: number) {
            this.selection = index;
            if (this.selection >= this.navOptions.length - 1 && this.controlsEnabled) {
                if ('alt' in window) {
                    alt.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.DISABLE_CONTROLS, true);
                }
                this.controlsEnabled = false;
            }
            if (!this.controlsEnabled) {
                if ('alt' in window) {
                    alt.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.DISABLE_CONTROLS, false);
                }
                this.controlsEnabled = true;
            }
        },
        setReady(noDiscard = true, noName = true) {
            if (this.show) {
                return;
            }

            this.noDiscard = noDiscard;
            this.noName = noName;
            this.show = true;

            if (!('alt' in window)) {
                return;
            }

            alt.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.READY_SETUP_COMPLETE);
        },
        setParameter(parameter: string, value: any, arrayIndex: number = null) {
            if (typeof value !== 'number' && typeof value !== 'object') {
                value = parseFloat(value);
            }
            if (parameter === 'sex') {
                this.data.faceFather = value === 0 ? 33 : 0;
                this.data.faceMother = value === 0 ? 45 : 0;
                this.data.skinFather = value === 0 ? 45 : 0;
                this.data.skinMother = value === 0 ? 45 : 0;
                this.data.skinMix = 0.5;
                this.data.faceMix = 0.5;
                this.data.facialHair = 29;
                this.data.facialHairColor1 = 0;
                this.data.eyebrows = 0;
            }
            if (arrayIndex === undefined || arrayIndex === null) {
                if (isNaN(value as number)) this.data[parameter] = value;
                else this.data[parameter] = parseFloat(value.toString());
            } else {
                if (isNaN(value as number)) this.data[parameter][arrayIndex] = value;
                else this.data[parameter][arrayIndex] = parseFloat(value.toString());
            }
            this.forceUpdate += 1;
            this.updateCharacter();
        },
        decrementParameter(
            parameter: string,
            min: number,
            max: number,
            incrementValue: number,
            arrayIndex: number = null,
        ) {
            if (arrayIndex === null || arrayIndex === undefined) {
                this.data[parameter] -= incrementValue;

                if (this.data[parameter] < min) {
                    this.data[parameter] = max;
                }
            } else {
                this.data[parameter][arrayIndex] -= incrementValue;

                if (this.data[parameter][arrayIndex] < min) {
                    this.data[parameter][arrayIndex] = max;
                }
            }

            this.forceUpdate += 1;
            this.updateCharacter();
        },
        incrementParameter(
            parameter: string,
            min: number,
            max: number,
            incrementValue: number,
            arrayIndex: number = null,
        ) {
            if (arrayIndex === null || arrayIndex === undefined) {
                this.data[parameter] += incrementValue;

                if (this.data[parameter] > max) {
                    this.data[parameter] = min;
                }
            } else {
                this.data[parameter][arrayIndex] += incrementValue;

                if (this.data[parameter][arrayIndex] > max) {
                    this.data[parameter][arrayIndex] = min;
                }
            }

            this.forceUpdate += 1;
            this.updateCharacter();
        },
        setData(oldData, totalCharacters) {
            this.totalCharacters = totalCharacters;

            if (!oldData) {
                this.updateCharacter();
                return;
            }

            this.data = oldData;
            this.updateCharacter();
        },
        setInfoData(parameter: string, value: any) {
            this.infoData[parameter] = value;
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        updateCharacter() {
            const isFemale = this.data.sex === 0;
            this.data.hairOverlay = isFemale ? FemaleHairOverlays[this.data.hair] : MaleHairOverlays[this.data.hair];

            if (isFemale) {
                this.data.facialHair = 30;
                this.data.facialHairOpacity = 0;
            }

            // Update Floats
            this.data.skinMix = parseFloat(this.data.skinMix);
            this.data.faceMix = parseFloat(this.data.faceMix);
            this.forceUpdate += 1;

            if (!('alt' in window)) {
                return;
            }

            alt.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.SYNC, JSON.parse(JSON.stringify(this.data)));
        },
        resetSelection() {
            this.selection = 0;
        },
    },
    mounted() {
        OverlaysList.forEach((overlay) => {
            const overlayData = { ...overlay };
            overlayData.value = 0;
            delete overlayData.max;
            delete overlayData.min;
            delete overlayData.increment;

            this.data.opacityOverlays.push(overlayData);
        });

        MakeupList.forEach((overlay) => {
            const overlayData = { ...overlay };
            overlayData.value = 0;
            delete overlayData.max;
            delete overlayData.min;
            delete overlayData.increment;

            this.data.colorOverlays.push(overlayData);
        });

        if ('alt' in window) {
            alt.on(CHARACTER_CREATOR_WEBVIEW_EVENTS.READY, this.setReady);
            alt.on(CHARACTER_CREATOR_WEBVIEW_EVENTS.SET_DATA, this.setData);
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(CHARACTER_CREATOR_WEBVIEW_EVENTS.READY, this.setReady);
            alt.off(CHARACTER_CREATOR_WEBVIEW_EVENTS.SET_DATA, this.setData);
        }
    },
});
</script>

<style scoped>
/* This style is applied to only this page */
.container {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, rgba(0, 0, 0, 1), transparent 35%);
}

.creator {
    position: fixed;
    min-width: 400px;
    min-height: 100vh;
    max-height: 100vh;
    background: rgba(12, 12, 12, 1) !important;
    right: 0;
    border-left: 2px solid rgba(64, 64, 64, 1);
}

.navigation {
    border-bottom: 2px solid rgba(64, 64, 64, 1);
    min-height: 75px !important;
    box-sizing: border-box !important;
}

.inner-page {
    display: block;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
}
</style>

<style>
/* This style is applied to all components too */
.subtitle-2 {
    white-space: pre-line !important;
}
</style>
