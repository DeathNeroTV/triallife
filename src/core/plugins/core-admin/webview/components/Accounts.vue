<template>
    <div class="wrapper split-center no-overflow">
        <span class="fill-full-width center pt-2 pb-2 text-lg-h5 mb-2 outlined">{{ title }}</span>
        <div class="list fill-full-width">
            <table class="fill-full-width">
                <thead class="grey darken-4" style="text-align: center">
                    <tr>
                        <th class="pl-5 pr-5 pt-2 pb-2">ID</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Discord ID</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Ip's</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Hardware</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Letzter Login</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Adminstufe</th>
                        <th class="pl-5 pr-5 pt-2 pb-2">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(account, index) in list" :class="'grey ' + (index % 2 === 0 ? 'darken-2' : 'darken-3')" style="text-align: center">
                        <td>{{ account._id }}</td>
                        <td>{{ account.discord }}</td>
                        <td>{{ account.ips.toString() }}</td>
                        <td>{{ account.hardware.toString() }}</td>
                        <td>{{ new Date(account.lastLogin).toLocaleString('de-DE').replace(',', ' |') }}</td>
                        <td>{{ getPermissionName(account.permissionLevel).toUpperCase() }}</td>
                        <td class="split split-center ma-1">
                            <Button class="fill-full-width" color="green" :glow="true" :raise="true" @click="e => $emit('modify-data', 'accounts', account)">
                                <Icon icon="icon-edit" :size="12"></Icon>
                            </Button>
                            <Button class="fill-full-width ml-1" color="green" :glow="true" :raise="true" @click="e => $emit('delete-data', 'accounts', account)">
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

import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Input from '@components/Input.vue';

const ComponentName = 'Accounts';
export default defineComponent({
    name: ComponentName,
    props: {
        title: String,
        list: Array,
    },
    data() {
        return {
            headers: [{}],
        };
    },
    components: {
        Button,
        Icon,
        Input,
    },
    computed: {},
    methods: {
        getLastLogin: function (time: number) {
            return new Date(time);
        },
        getPermissionName: function (perm: number) {
            switch (perm) {
                case 0:
                    return 'spieler';
                case 1:
                    return 'vip';
                case 2:
                    return 'moderator';
                case 4:
                    return 'administrator';
                case 8:
                    return 'inhaber';
                default:
                    return 'unbekannt';
            }
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
