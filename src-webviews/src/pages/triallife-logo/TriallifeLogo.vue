<template>
    <div class="logo-frame">
        <img :src="ResolvePath(`../../assets/images/logo.png`)" width="1024" />
        <div class="green--text text-lg-h2 mt-10 mb-2">Early-Access-Alpha</div>
        <div class="grey--text text-darken-2 text-lg-h3 mt-2">(In Arbeit)</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResolvePath from '../../utility/pathResolver';

const ComponentName = 'TriallifeLogo';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            //
        };
    },
    methods: {
        ResolvePath,
    },
});
</script>

<style scoped>
.logo-frame {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    user-select: none;
    min-width: 100vw;
    height: 100vh;
    backface-visibility: hidden;
    animation: fadein ease 0.5s;
    background: rgba(25, 25, 25, 1) !important;
    align-content: center;
    align-items: center;
    justify-content: center;
    animation: fade-in-out 5s ease-in-out;
    opacity: 0;
}

@keyframes fade-in-out {
    0% {
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>
