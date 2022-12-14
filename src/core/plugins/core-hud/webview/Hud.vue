<template>
    <div class="wrapper-hud" :style="getWrapperStyle">
        <div class="status-bars" v-if="hudState === hudStateNames.SHOW_HUD">
            <Health :value="dead ? 0 : health" />
            <Microphone :value="microphone" v-if="microphone !== undefined" />
            <template v-if="!dead">
                <Water :value="water" v-if="water <= 95" />
                <Food :value="food" v-if="food <= 95" />
                <Armour :value="armour" v-if="armour >= 5" />
            </template>
            <Fuel v-if="isInVehicle" :value="fuel" />
        </div>
        <div class="key-info overline">[{{ switchKey }}]</div>
        <div class="info-bars" v-if="hudState === hudStateNames.SHOW_WALLET">
            <Cash class="mb-2" :value="cash" />
            <Identifier class="mb-2" :value="identifier" />
            <Time class="mb-2" :value="time" />
        </div>
        <div class="hidden" v-if="hudState === hudStateNames.HIDDEN">
            <Icon :shadow="false" class="hidden-icon" icon="icon-eye" :size="48" />
        </div>
        <div class="speedo-placement" v-if="isInVehicle && hudState !== hudStateNames.HIDDEN">
            <Speed :isMetric="isMetric" :speed="speed" :gear="gear" />
            <div class="vehicle-bars">
                <Engine :status="engine" />
                <Seatbelt :status="seatbelt" />
                <Lock :status="lock" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import WebViewEvents from '../../../../../src-webviews/src/utility/webViewEvents';

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'Hud';
export default defineComponent({
    name: ComponentName,
    // Used to add Custom Components
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Armour: defineAsyncComponent(() => import('./components/Armour.vue')),
        Cash: defineAsyncComponent(() => import('./components/Cash.vue')),
        Food: defineAsyncComponent(() => import('./components/Food.vue')),
        Microphone: defineAsyncComponent(() => import('./components/Microphone.vue')),
        Interaction: defineAsyncComponent(() => import('./components/Interaction.vue')),
        Health: defineAsyncComponent(() => import('./components/Health.vue')),
        Water: defineAsyncComponent(() => import('./components/Water.vue')),
        Bank: defineAsyncComponent(() => import('./components/Bank.vue')),
        Time: defineAsyncComponent(() => import('./components/Time.vue')),
        Speed: defineAsyncComponent(() => import('./components/Speed.vue')),
        Seatbelt: defineAsyncComponent(() => import('./components/Seatbelt.vue')),
        Engine: defineAsyncComponent(() => import('./components/Engine.vue')),
        Lock: defineAsyncComponent(() => import('./components/Lock.vue')),
        Fuel: defineAsyncComponent(() => import('./components/Fuel.vue')),
        Identifier: defineAsyncComponent(() => import('./components/Identifier.vue')),
    },
    // Used to define state
    data() {
        return {
            switchKey: 'F2',
            health: 124,
            armour: 50,
            food: 85,
            water: 85,
            dead: undefined,
            microphone: undefined,
            identifier: 999,
            cash: 5000000,
            bank: 1000000,
            time: '05:53 PM',
            speed: 0,
            engine: false,
            gear: 0,
            fuel: 75,
            lock: false,
            seatbelt: false,
            isMetric: true,
            isInVehicle: false,
            interactions: [] as Array<{ keyPress: string; description: string }>,
            updateCount: 0,
            hudState: 'hud',
            hudStateNames: {
                SHOW_HUD: 'hud',
                SHOW_WALLET: 'wallet',
                HIDDEN: 'hidden',
            },
        };
    },
    mounted() {
        if ('alt' in window) {
            WebViewEvents.on(`${ComponentName}:SwitchHudState`, this.switchHudState);
            WebViewEvents.on(`${ComponentName}:SetProp`, this.setProp);
            WebViewEvents.emitReady(ComponentName);
        } else {
            this.isInVehicle = true;
            this.setProp(
                'interactions',
                JSON.stringify([
                    { keyPress: 'E', description: 'Press To Do Something' },
                    { keyPress: 'F', description: 'Help Me' },
                    { keyPress: 'G', description: 'Do Not Buy Doge Coin' },
                ]),
                true,
            );

            document.addEventListener('keydown', (ev: KeyboardEvent) => {
                if (ev.keyCode !== 113) {
                    return;
                }

                switch (this.hudState) {
                    case 'hud':
                        this.hudState = 'wallet';
                        break;
                    case 'wallet':
                        this.hudState = 'hidden';
                        break;
                    case 'hidden':
                        this.hudState = 'hud';
                        break;
                }
            });

            setInterval(() => {
                // this.speed += 2;
                if (this.speed >= 200) {
                    this.speed = 0;
                }

                if (this.speed === 0) {
                    this.gear = 0;
                }

                if (this.speed === 20) {
                    this.gear = 1;
                }

                if (this.speed === 40) {
                    this.gear = 2;
                }

                if (this.speed === 60) {
                    this.gear = 3;
                }

                if (this.speed === 80) {
                    this.gear = 4;
                }

                if (this.speed === 100) {
                    this.gear = 5;
                }
            }, 25);
        }
    },
    computed: {
        getWrapperStyle() {
            if ('alt' in window) return '';
            return `background: url('https://i.imgur.com/wtCnL7Z.jpeg') !important; background-size: 100% 100% !important;`;
        },
    },
    methods: {
        setProp(propName: string, propValue: any, isJSON = false) {
            let wasJSON = false;
            if (isJSON) {
                propValue = JSON.parse(propValue);
                wasJSON = true;
            }
            this[propName] = propValue;
            if (wasJSON) this.updateCount += 1;
        },
        switchHudState(state: string) {
            this.hudState = state;
        },
    },
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;500;600;700&display=swap');

.wrapper-hud {
    display: flex;
    position: absolute;
    min-height: 100vh;
    min-width: 100vw;
    overflow: hidden;
}

.key-info {
    position: absolute;
    top: 3vh;
    right: 0;
    display: flex;
    min-width: 45px;
    justify-content: center;
    font-weight: 900 !important;
    opacity: 0.5 !important;
}

.info-bars .key-info {
    justify-content: flex-end;
    margin-top: 6px !important;
}

.speedo-placement {
    display: flex;
}

.info-bars,
.status-bars,
.hidden {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    position: fixed;
    top: 1vh;
    right: 50%;
    transform: translateX(50%);
}
.info-bars > *,
.status-bars > * {
    margin-left: 12px;
}

.info-bars .stat-wrapper {
    margin-bottom: 12px !important;
}

.vehicle-bars {
    display: flex;
    flex-direction: row;
    position: fixed;
    right: 1vw;
    bottom: 1vh;
}

.vehicle-bars > * {
    margin-left: 12px;
}

.hidden-icon {
    animation: fade-out 3s forwards;
    opacity: 0;
}

@keyframes fade-out {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

@media screen and (max-width: 1280px) {
    .bar {
        min-width: 30px !important;
        max-width: 30px !important;
        min-height: 30px !important;
        max-height: 30px !important;
        border-radius: 50% !important;
    }

    .bar-shadow {
        min-width: 34px !important;
        max-width: 34px !important;
        min-height: 34px !important;
        max-height: 34px !important;
        border-radius: 50% !important;
        box-shadow: inset 0px 0px 0px 4px rgba(0, 0, 0, 0.3) !important;
    }

    .stat-icon {
        justify-content: center !important;
        min-width: 30px !important;
        max-width: 30px !important;
        min-height: 30px !important;
        max-height: 30px !important;
    }

    .fill {
        min-width: 36px !important;
        max-width: 36px !important;
        left: -5px !important;
    }

    .icon {
        font-size: 14px !important;
    }

    .key-info {
        min-width: 25px;
    }
}
</style>
