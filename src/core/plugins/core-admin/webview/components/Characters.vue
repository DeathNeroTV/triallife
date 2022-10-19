<template>
    <div class="wrapper split-center no-overflow">  
        <span class="fill-full-width center pt-2 pb-2 text-lg-h5 mb-2 outlined">{{ title }}</span>
        <dic class="list fill-full-width">
            <table class="fill-full-width">
                <thead class="grey darken-4" style="text-align: center">
                    <tr>
                        <th class="pl-5 pr-5 pt-2 pb-2">ID</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Name</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Geburtsdatum</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Geschlecht</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Bargeld in $</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Bewusstlos</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Gebannt</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(character, index) in list" :class="'grey ' + (index % 2 === 0 ? 'darken-2' : 'darken-3')" style="text-align: center">
                        <td>{{ character.character_id }}</td>
                        <td>{{ character.info.name }}</td>
                        <td>{{ character.info.age }}</td>
                        <td>{{ character.info.gender }}</td>
                        <td>{{ getCashFixed(character.cash) }}</td>
                        <td>{{ character.isDead ? 'Ja' : 'Nein' }}</td>
                        <td>{{ character.banned.state ? character.banned.reason : 'Nein' }}</td>
                        <td class="split split-center ma-1">
                            <Button class="fill-full-width mr-1" color="red" :glow="true" :raise="true" @click="e => $emit('toggle-ban', character.character_id, false, '', true)" v-if="character.banned.state">
                                <Icon icon="icon-ban" :size="12"></Icon>
                            </Button>
                            <Button class="fill-full-width mr-1" color="green" :glow="true" :raise="true" @click="e => $emit('toggle-ban', character.character_id, true, '')" v-else>
                                <Icon icon="icon-ban" :size="12"></Icon>
                            </Button>
                            <Button class="fill-full-width" color="green" :glow="true" :raise="true" @click="">
                                <Icon icon="icon-edit" :size="12"></Icon>
                            </Button>
                            <Button class="fill-full-width ml-1" color="green" :glow="true" :raise="true" @click="">
                                <Icon icon="icon-bin" :size="12"></Icon>
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </dic>        
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ComponentName as PageName } from '../Admin.vue';

import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Input from '@components/Input.vue';

const ComponentName = 'Characters';
export default defineComponent({
    name: ComponentName,
    props: {
        title: String,
        list: Array,
    },
    data() {
        return {};
    },
    components: {
        Button,
        Icon,
        Input,
    },
    computed: {},
    methods: {
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