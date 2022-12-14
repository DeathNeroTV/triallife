<template>
    <div class="wrapper">
        <Modal>
            <Frame minWidth="40vw" maxWidth="40vw" minHeight="50vh" maxHeight="50vh" :scrollable="true">
                <template v-slot:toolbar>
                    <Toolbar :overrideCallback="true" @close-click="close">
                        <div class="split split-center space-between">
                            <span class="green--text">Neues Fahrzeug erwerben</span>
                            <span class="grey--text">&nbsp;-&nbsp;</span>
                            <span class="blue--text mr-2">{{ getBankFixed }} $</span>
                        </div>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="stack fill-full-width">
                        <template v-if="getVehicles.length <= 0">
                            <h2>Keine Fahrzeuge vorhanden</h2>
                        </template>
                        <template v-else>
                            <div class="vehicle-option split fill-full-width space-between mb-4" v-for="(vehicle, index) in getVehicles" :key="index">
                                <div class="vehicle-image">
                                    <img :src="ResolvePath(`../../assets/vehicles/${vehicle.model}.png`)" />
                                </div>
                                <div class="vehicle-name subtitle-2">Model: {{ vehicle.model }}</div>
                                <div class="vehicle-name subtitle-2">Preis: {{ getCashFixed(vehicle.price) }} $</div>
                                <template v-if="faction.bank >= vehicle.price">
                                    <Button class="veh-button mr-4" color="green" @click="(e) => purchase(vehicle.model)">
                                        <Icon :size="14" icon="icon-dollar" />
                                    </Button>
                                </template>
                                <template v-else>
                                    <Button class="veh-button mr-4" color="red" :disable="true">
                                        <Icon :size="14" icon="icon-dollar" />
                                    </Button>
                                </template>
                            </div>
                        </template>
                    </div>
                </template>
            </Frame>
        </Modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Faction } from '../../../shared/interfaces';
import ResolvePath from '@utility/pathResolver';

const ComponentName = 'AddVehicle';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Modal: defineAsyncComponent(() => import('@components/Modal.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
    },
    props: {
        faction: {
            type: Object as () => Faction,
            default: null,
        },
    },
    data() {
        return {
            ResolvePath: ResolvePath,
        };
    },
    computed: {
        getVehicles() {
            return this.faction.settings && this.faction.settings.vehicles ? this.faction.settings.vehicles : [];
        },
        getBankFixed() {
            var parts = this.faction.bank.toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return parts.join(',');
        },
    },
    methods: {
        close() {
            this.$emit('close');
        },
        purchase(model: string) {
            this.$emit('purchase-vehicle', model);
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
input {
    align-self: center;
    font-family: 'Roboto', sans-serif;
    background: rgba(12, 12, 12, 1);
    border: 2px solid rgba(36, 36, 36, 1);
    padding: 6px;
    width: 100%;
    box-sizing: border-box;
    color: white;
}

input:focus {
    border-color: rgba(52, 52, 52, 1);
}

.vehicle-option {
    background: rgba(22, 22, 22, 1);
    padding: 12px;
    box-sizing: border-box;
    border-radius: 6px;
    border: 2px solid rgba(36, 36, 36, 1);
}
</style>
