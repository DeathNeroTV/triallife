<template>
    <div class="background">
        <div class="circle-container" v-for="n in 100">
            <div class="circle"></div>
        </div>
        <div class="container">
            <div class="stack center">
                <img class="discord center mb-4 mt-4" :src="ResolvePath(`../../assets/images/logo.png`)" />
                <span class="grey--text boldest mb-5">Willkommen auf dem Server von Trial Life</span>
            </div>
            <div class="split split-full fill-full-width">
                <div></div>
                <Button color="green" help="Mit Discord anmelden" @click="finishAuth">
                    <Icon icon="icon-login" :size="36"></Icon>
                </Button>
                <span class=" fill-full-width center" style="word-wrap: normal; text-justify: auto;">{{ errorMessage }}</span>
                <Button color="red" help="Server verlassen" @click="leaveServer">
                    <Icon icon="icon-exit" :size="36"></Icon>
                </Button>
                <div></div>
            </div> 
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { DISCORD_LOGIN_EVENTS } from '../shared/events';

import ResolvePath from '../../../../../src-webviews/src/utility/pathResolver';
import WebViewEvents from '../../../../../src-webviews/src/utility/webViewEvents';

const ComponentName = 'Login';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
    },
    data() {
        return {
            isAuthorizing: false,
            isFinishAuthReady: false,
            errorMessage: '',
            errorTimer: -1,
        };
    },
    methods: {
        ResolvePath,
        leaveServer() {
            this.isFinishAuthReady = false;
            WebViewEvents.emitServer(DISCORD_LOGIN_EVENTS.TO_SERVER.TRY_LEAVE);
            this.delayFinishAuthButton();
            if (!('alt' in window)) this.setErrorMessage('Server wurde verlassen');
        },
        finishAuth() {
            WebViewEvents.emitClient(DISCORD_LOGIN_EVENTS.TO_CLIENT.TRY_FINISH);
            this.delayFinishAuthButton();
            if (!('alt' in window)) this.setErrorMessage('Anmeldung erfolgreich abgeschlossen');
        },
        setErrorMessage(message: string) {
            this.isFinishAuthReady = false;
            this.errorMessage = message;
            if (this.errorTimer > -1) clearTimeout(this.errorTimer);
            this.errorTimer = setTimeout(() => (this.errorMessage = ''), 10000);
        },
        delayFinishAuthButton() {
            this.isFinishAuthReady = false;
            setTimeout(() => (this.isFinishAuthReady = true), 2500);
        },
    },
    mounted() {
        WebViewEvents.on(DISCORD_LOGIN_EVENTS.TO_WEBVIEW.SET_ERROR_MESSAGE, this.setErrorMessage);
        WebViewEvents.emitReady('Login');
        if ('alt' in window) {
            alt.on(`${ComponentName}:endWindow`, this.endWindow);
            alt.on(`${ComponentName}:Fail`, this.fail);
        }
    },
});
</script>

<style scoped>
.background {
    width: 100vw;
    height: 100vh;
    background: url('../../assets/images/bg_login.jpg');
}

.container {
    position: fixed;
    top: 50%;
    left: 50%;
    min-width: 30vw;
    max-width: 30vw;
    transform: translate(-50%, -50%);
    background: rgba(12, 12, 12, 0.5);
    padding: 1vh;
}
.discord {
    opacity: 0.5;
    max-width: 250px;
    transition: all 1s;
}

.discord:hover {
    opacity: 0.75;
}

.circle-container {
    position: absolute;
    transform: translateY(-10vh);
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
}

.circle-container .circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    mix-blend-mode: screen;
    background-image: radial-gradient(rgba(0, 135, 54, 0.5), rgba(0, 135, 54, 1) 10%, rgba(0, 135, 54, 0) 56%);
    -webkit-animation: fadein-frames 200ms infinite, scale-frames 2s infinite;
    animation: fadein-frames 200ms infinite, scale-frames 2s infinite;
}

@-webkit-keyframes fade-frames {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
    100% {
        opacity: 1;
    }
}
@keyframes fade-frames {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
    100% {
        opacity: 1;
    }
}
@-webkit-keyframes scale-frames {
    0% {
        transform: scale3d(0.4, 0.4, 1);
    }
    50% {
        transform: scale3d(2.2, 2.2, 1);
    }
    100% {
        transform: scale3d(0.4, 0.4, 1);
    }
}
@keyframes scale-frames {
    0% {
        transform: scale3d(0.4, 0.4, 1);
    }
    50% {
        transform: scale3d(2.2, 2.2, 1);
    }
    100% {
        transform: scale3d(0.4, 0.4, 1);
    }
}
.circle-container:nth-child(1) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-1;
    animation-name: move-frames-1;
    -webkit-animation-duration: 30178ms;
    animation-duration: 30178ms;
    -webkit-animation-delay: 15681ms;
    animation-delay: 15681ms;
}

@-webkit-keyframes move-frames-1 {
    from {
        transform: translate3d(38vw, 103vh, 0);
    }
    to {
        transform: translate3d(7vw, -132vh, 0);
    }
}
@keyframes move-frames-1 {
    from {
        transform: translate3d(38vw, 103vh, 0);
    }
    to {
        transform: translate3d(7vw, -132vh, 0);
    }
}
.circle-container:nth-child(1) .circle {
    -webkit-animation-delay: 1159ms;
    animation-delay: 1159ms;
}
.circle-container:nth-child(2) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-2;
    animation-name: move-frames-2;
    -webkit-animation-duration: 32103ms;
    animation-duration: 32103ms;
    -webkit-animation-delay: 16075ms;
    animation-delay: 16075ms;
}
@-webkit-keyframes move-frames-2 {
    from {
        transform: translate3d(19vw, 107vh, 0);
    }
    to {
        transform: translate3d(74vw, -108vh, 0);
    }
}
@keyframes move-frames-2 {
    from {
        transform: translate3d(19vw, 107vh, 0);
    }
    to {
        transform: translate3d(74vw, -108vh, 0);
    }
}
.circle-container:nth-child(2) .circle {
    -webkit-animation-delay: 2238ms;
    animation-delay: 2238ms;
}
.circle-container:nth-child(3) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-3;
    animation-name: move-frames-3;
    -webkit-animation-duration: 29717ms;
    animation-duration: 29717ms;
    -webkit-animation-delay: 3637ms;
    animation-delay: 3637ms;
}
@-webkit-keyframes move-frames-3 {
    from {
        transform: translate3d(64vw, 106vh, 0);
    }
    to {
        transform: translate3d(40vw, -112vh, 0);
    }
}
@keyframes move-frames-3 {
    from {
        transform: translate3d(64vw, 106vh, 0);
    }
    to {
        transform: translate3d(40vw, -112vh, 0);
    }
}
.circle-container:nth-child(3) .circle {
    -webkit-animation-delay: 501ms;
    animation-delay: 501ms;
}
.circle-container:nth-child(4) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-4;
    animation-name: move-frames-4;
    -webkit-animation-duration: 29967ms;
    animation-duration: 29967ms;
    -webkit-animation-delay: 23470ms;
    animation-delay: 23470ms;
}
@-webkit-keyframes move-frames-4 {
    from {
        transform: translate3d(48vw, 101vh, 0);
    }
    to {
        transform: translate3d(78vw, -124vh, 0);
    }
}
@keyframes move-frames-4 {
    from {
        transform: translate3d(48vw, 101vh, 0);
    }
    to {
        transform: translate3d(78vw, -124vh, 0);
    }
}
.circle-container:nth-child(4) .circle {
    -webkit-animation-delay: 2997ms;
    animation-delay: 2997ms;
}
.circle-container:nth-child(5) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-5;
    animation-name: move-frames-5;
    -webkit-animation-duration: 32189ms;
    animation-duration: 32189ms;
    -webkit-animation-delay: 8076ms;
    animation-delay: 8076ms;
}
@-webkit-keyframes move-frames-5 {
    from {
        transform: translate3d(26vw, 104vh, 0);
    }
    to {
        transform: translate3d(90vw, -114vh, 0);
    }
}
@keyframes move-frames-5 {
    from {
        transform: translate3d(26vw, 104vh, 0);
    }
    to {
        transform: translate3d(90vw, -114vh, 0);
    }
}
.circle-container:nth-child(5) .circle {
    -webkit-animation-delay: 1511ms;
    animation-delay: 1511ms;
}
.circle-container:nth-child(6) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-6;
    animation-name: move-frames-6;
    -webkit-animation-duration: 35902ms;
    animation-duration: 35902ms;
    -webkit-animation-delay: 26507ms;
    animation-delay: 26507ms;
}
@-webkit-keyframes move-frames-6 {
    from {
        transform: translate3d(83vw, 107vh, 0);
    }
    to {
        transform: translate3d(59vw, -123vh, 0);
    }
}
@keyframes move-frames-6 {
    from {
        transform: translate3d(83vw, 107vh, 0);
    }
    to {
        transform: translate3d(59vw, -123vh, 0);
    }
}
.circle-container:nth-child(6) .circle {
    -webkit-animation-delay: 1823ms;
    animation-delay: 1823ms;
}
.circle-container:nth-child(7) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-7;
    animation-name: move-frames-7;
    -webkit-animation-duration: 32268ms;
    animation-duration: 32268ms;
    -webkit-animation-delay: 13318ms;
    animation-delay: 13318ms;
}
@-webkit-keyframes move-frames-7 {
    from {
        transform: translate3d(97vw, 105vh, 0);
    }
    to {
        transform: translate3d(10vw, -113vh, 0);
    }
}
@keyframes move-frames-7 {
    from {
        transform: translate3d(97vw, 105vh, 0);
    }
    to {
        transform: translate3d(10vw, -113vh, 0);
    }
}
.circle-container:nth-child(7) .circle {
    -webkit-animation-delay: 2345ms;
    animation-delay: 2345ms;
}
.circle-container:nth-child(8) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-8;
    animation-name: move-frames-8;
    -webkit-animation-duration: 30253ms;
    animation-duration: 30253ms;
    -webkit-animation-delay: 12474ms;
    animation-delay: 12474ms;
}
@-webkit-keyframes move-frames-8 {
    from {
        transform: translate3d(81vw, 101vh, 0);
    }
    to {
        transform: translate3d(53vw, -116vh, 0);
    }
}
@keyframes move-frames-8 {
    from {
        transform: translate3d(81vw, 101vh, 0);
    }
    to {
        transform: translate3d(53vw, -116vh, 0);
    }
}
.circle-container:nth-child(8) .circle {
    -webkit-animation-delay: 2331ms;
    animation-delay: 2331ms;
}
.circle-container:nth-child(9) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-9;
    animation-name: move-frames-9;
    -webkit-animation-duration: 31529ms;
    animation-duration: 31529ms;
    -webkit-animation-delay: 20940ms;
    animation-delay: 20940ms;
}
@-webkit-keyframes move-frames-9 {
    from {
        transform: translate3d(56vw, 108vh, 0);
    }
    to {
        transform: translate3d(11vw, -117vh, 0);
    }
}
@keyframes move-frames-9 {
    from {
        transform: translate3d(56vw, 108vh, 0);
    }
    to {
        transform: translate3d(11vw, -117vh, 0);
    }
}
.circle-container:nth-child(9) .circle {
    -webkit-animation-delay: 608ms;
    animation-delay: 608ms;
}
.circle-container:nth-child(10) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-10;
    animation-name: move-frames-10;
    -webkit-animation-duration: 33264ms;
    animation-duration: 33264ms;
    -webkit-animation-delay: 34684ms;
    animation-delay: 34684ms;
}
@-webkit-keyframes move-frames-10 {
    from {
        transform: translate3d(31vw, 110vh, 0);
    }
    to {
        transform: translate3d(100vw, -117vh, 0);
    }
}
@keyframes move-frames-10 {
    from {
        transform: translate3d(31vw, 110vh, 0);
    }
    to {
        transform: translate3d(100vw, -117vh, 0);
    }
}
.circle-container:nth-child(10) .circle {
    -webkit-animation-delay: 1130ms;
    animation-delay: 1130ms;
}
.circle-container:nth-child(11) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-11;
    animation-name: move-frames-11;
    -webkit-animation-duration: 30403ms;
    animation-duration: 30403ms;
    -webkit-animation-delay: 6419ms;
    animation-delay: 6419ms;
}
@-webkit-keyframes move-frames-11 {
    from {
        transform: translate3d(35vw, 109vh, 0);
    }
    to {
        transform: translate3d(89vw, -130vh, 0);
    }
}
@keyframes move-frames-11 {
    from {
        transform: translate3d(35vw, 109vh, 0);
    }
    to {
        transform: translate3d(89vw, -130vh, 0);
    }
}
.circle-container:nth-child(11) .circle {
    -webkit-animation-delay: 3445ms;
    animation-delay: 3445ms;
}
.circle-container:nth-child(12) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-12;
    animation-name: move-frames-12;
    -webkit-animation-duration: 32448ms;
    animation-duration: 32448ms;
    -webkit-animation-delay: 16903ms;
    animation-delay: 16903ms;
}
@-webkit-keyframes move-frames-12 {
    from {
        transform: translate3d(51vw, 110vh, 0);
    }
    to {
        transform: translate3d(54vw, -115vh, 0);
    }
}
@keyframes move-frames-12 {
    from {
        transform: translate3d(51vw, 110vh, 0);
    }
    to {
        transform: translate3d(54vw, -115vh, 0);
    }
}
.circle-container:nth-child(12) .circle {
    -webkit-animation-delay: 1598ms;
    animation-delay: 1598ms;
}
.circle-container:nth-child(13) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-13;
    animation-name: move-frames-13;
    -webkit-animation-duration: 31588ms;
    animation-duration: 31588ms;
    -webkit-animation-delay: 13750ms;
    animation-delay: 13750ms;
}
@-webkit-keyframes move-frames-13 {
    from {
        transform: translate3d(44vw, 107vh, 0);
    }
    to {
        transform: translate3d(63vw, -129vh, 0);
    }
}
@keyframes move-frames-13 {
    from {
        transform: translate3d(44vw, 107vh, 0);
    }
    to {
        transform: translate3d(63vw, -129vh, 0);
    }
}
.circle-container:nth-child(13) .circle {
    -webkit-animation-delay: 3453ms;
    animation-delay: 3453ms;
}
.circle-container:nth-child(14) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-14;
    animation-name: move-frames-14;
    -webkit-animation-duration: 29822ms;
    animation-duration: 29822ms;
    -webkit-animation-delay: 30224ms;
    animation-delay: 30224ms;
}
@-webkit-keyframes move-frames-14 {
    from {
        transform: translate3d(35vw, 102vh, 0);
    }
    to {
        transform: translate3d(20vw, -119vh, 0);
    }
}
@keyframes move-frames-14 {
    from {
        transform: translate3d(35vw, 102vh, 0);
    }
    to {
        transform: translate3d(20vw, -119vh, 0);
    }
}
.circle-container:nth-child(14) .circle {
    -webkit-animation-delay: 165ms;
    animation-delay: 165ms;
}
.circle-container:nth-child(15) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-15;
    animation-name: move-frames-15;
    -webkit-animation-duration: 35936ms;
    animation-duration: 35936ms;
    -webkit-animation-delay: 28065ms;
    animation-delay: 28065ms;
}
@-webkit-keyframes move-frames-15 {
    from {
        transform: translate3d(12vw, 102vh, 0);
    }
    to {
        transform: translate3d(48vw, -117vh, 0);
    }
}
@keyframes move-frames-15 {
    from {
        transform: translate3d(12vw, 102vh, 0);
    }
    to {
        transform: translate3d(48vw, -117vh, 0);
    }
}
.circle-container:nth-child(15) .circle {
    -webkit-animation-delay: 798ms;
    animation-delay: 798ms;
}
.circle-container:nth-child(16) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-16;
    animation-name: move-frames-16;
    -webkit-animation-duration: 30874ms;
    animation-duration: 30874ms;
    -webkit-animation-delay: 7066ms;
    animation-delay: 7066ms;
}
@-webkit-keyframes move-frames-16 {
    from {
        transform: translate3d(14vw, 110vh, 0);
    }
    to {
        transform: translate3d(73vw, -127vh, 0);
    }
}
@keyframes move-frames-16 {
    from {
        transform: translate3d(14vw, 110vh, 0);
    }
    to {
        transform: translate3d(73vw, -127vh, 0);
    }
}
.circle-container:nth-child(16) .circle {
    -webkit-animation-delay: 2574ms;
    animation-delay: 2574ms;
}
.circle-container:nth-child(17) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-17;
    animation-name: move-frames-17;
    -webkit-animation-duration: 32148ms;
    animation-duration: 32148ms;
    -webkit-animation-delay: 216ms;
    animation-delay: 216ms;
}
@-webkit-keyframes move-frames-17 {
    from {
        transform: translate3d(60vw, 109vh, 0);
    }
    to {
        transform: translate3d(60vw, -111vh, 0);
    }
}
@keyframes move-frames-17 {
    from {
        transform: translate3d(60vw, 109vh, 0);
    }
    to {
        transform: translate3d(60vw, -111vh, 0);
    }
}
.circle-container:nth-child(17) .circle {
    -webkit-animation-delay: 3638ms;
    animation-delay: 3638ms;
}
.circle-container:nth-child(18) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-18;
    animation-name: move-frames-18;
    -webkit-animation-duration: 28108ms;
    animation-duration: 28108ms;
    -webkit-animation-delay: 33099ms;
    animation-delay: 33099ms;
}
@-webkit-keyframes move-frames-18 {
    from {
        transform: translate3d(65vw, 109vh, 0);
    }
    to {
        transform: translate3d(33vw, -115vh, 0);
    }
}
@keyframes move-frames-18 {
    from {
        transform: translate3d(65vw, 109vh, 0);
    }
    to {
        transform: translate3d(33vw, -115vh, 0);
    }
}
.circle-container:nth-child(18) .circle {
    -webkit-animation-delay: 2577ms;
    animation-delay: 2577ms;
}
.circle-container:nth-child(19) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-19;
    animation-name: move-frames-19;
    -webkit-animation-duration: 29917ms;
    animation-duration: 29917ms;
    -webkit-animation-delay: 28533ms;
    animation-delay: 28533ms;
}
@-webkit-keyframes move-frames-19 {
    from {
        transform: translate3d(94vw, 104vh, 0);
    }
    to {
        transform: translate3d(20vw, -123vh, 0);
    }
}
@keyframes move-frames-19 {
    from {
        transform: translate3d(94vw, 104vh, 0);
    }
    to {
        transform: translate3d(20vw, -123vh, 0);
    }
}
.circle-container:nth-child(19) .circle {
    -webkit-animation-delay: 1845ms;
    animation-delay: 1845ms;
}
.circle-container:nth-child(20) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-20;
    animation-name: move-frames-20;
    -webkit-animation-duration: 28698ms;
    animation-duration: 28698ms;
    -webkit-animation-delay: 26887ms;
    animation-delay: 26887ms;
}
@-webkit-keyframes move-frames-20 {
    from {
        transform: translate3d(41vw, 110vh, 0);
    }
    to {
        transform: translate3d(50vw, -123vh, 0);
    }
}
@keyframes move-frames-20 {
    from {
        transform: translate3d(41vw, 110vh, 0);
    }
    to {
        transform: translate3d(50vw, -123vh, 0);
    }
}
.circle-container:nth-child(20) .circle {
    -webkit-animation-delay: 32ms;
    animation-delay: 32ms;
}
.circle-container:nth-child(21) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-21;
    animation-name: move-frames-21;
    -webkit-animation-duration: 35379ms;
    animation-duration: 35379ms;
    -webkit-animation-delay: 3777ms;
    animation-delay: 3777ms;
}
@-webkit-keyframes move-frames-21 {
    from {
        transform: translate3d(18vw, 101vh, 0);
    }
    to {
        transform: translate3d(61vw, -109vh, 0);
    }
}
@keyframes move-frames-21 {
    from {
        transform: translate3d(18vw, 101vh, 0);
    }
    to {
        transform: translate3d(61vw, -109vh, 0);
    }
}
.circle-container:nth-child(21) .circle {
    -webkit-animation-delay: 3134ms;
    animation-delay: 3134ms;
}
.circle-container:nth-child(22) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-22;
    animation-name: move-frames-22;
    -webkit-animation-duration: 34205ms;
    animation-duration: 34205ms;
    -webkit-animation-delay: 10889ms;
    animation-delay: 10889ms;
}
@-webkit-keyframes move-frames-22 {
    from {
        transform: translate3d(24vw, 104vh, 0);
    }
    to {
        transform: translate3d(72vw, -118vh, 0);
    }
}
@keyframes move-frames-22 {
    from {
        transform: translate3d(24vw, 104vh, 0);
    }
    to {
        transform: translate3d(72vw, -118vh, 0);
    }
}
.circle-container:nth-child(22) .circle {
    -webkit-animation-delay: 3546ms;
    animation-delay: 3546ms;
}
.circle-container:nth-child(23) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-23;
    animation-name: move-frames-23;
    -webkit-animation-duration: 34948ms;
    animation-duration: 34948ms;
    -webkit-animation-delay: 31336ms;
    animation-delay: 31336ms;
}
@-webkit-keyframes move-frames-23 {
    from {
        transform: translate3d(12vw, 110vh, 0);
    }
    to {
        transform: translate3d(80vw, -112vh, 0);
    }
}
@keyframes move-frames-23 {
    from {
        transform: translate3d(12vw, 110vh, 0);
    }
    to {
        transform: translate3d(80vw, -112vh, 0);
    }
}
.circle-container:nth-child(23) .circle {
    -webkit-animation-delay: 2183ms;
    animation-delay: 2183ms;
}
.circle-container:nth-child(24) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-24;
    animation-name: move-frames-24;
    -webkit-animation-duration: 29408ms;
    animation-duration: 29408ms;
    -webkit-animation-delay: 20712ms;
    animation-delay: 20712ms;
}
@-webkit-keyframes move-frames-24 {
    from {
        transform: translate3d(74vw, 103vh, 0);
    }
    to {
        transform: translate3d(66vw, -107vh, 0);
    }
}
@keyframes move-frames-24 {
    from {
        transform: translate3d(74vw, 103vh, 0);
    }
    to {
        transform: translate3d(66vw, -107vh, 0);
    }
}
.circle-container:nth-child(24) .circle {
    -webkit-animation-delay: 2043ms;
    animation-delay: 2043ms;
}
.circle-container:nth-child(25) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-25;
    animation-name: move-frames-25;
    -webkit-animation-duration: 34586ms;
    animation-duration: 34586ms;
    -webkit-animation-delay: 31264ms;
    animation-delay: 31264ms;
}
@-webkit-keyframes move-frames-25 {
    from {
        transform: translate3d(68vw, 101vh, 0);
    }
    to {
        transform: translate3d(86vw, -131vh, 0);
    }
}
@keyframes move-frames-25 {
    from {
        transform: translate3d(68vw, 101vh, 0);
    }
    to {
        transform: translate3d(86vw, -131vh, 0);
    }
}
.circle-container:nth-child(25) .circle {
    -webkit-animation-delay: 3799ms;
    animation-delay: 3799ms;
}
.circle-container:nth-child(26) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-26;
    animation-name: move-frames-26;
    -webkit-animation-duration: 30333ms;
    animation-duration: 30333ms;
    -webkit-animation-delay: 24695ms;
    animation-delay: 24695ms;
}
@-webkit-keyframes move-frames-26 {
    from {
        transform: translate3d(91vw, 102vh, 0);
    }
    to {
        transform: translate3d(38vw, -106vh, 0);
    }
}
@keyframes move-frames-26 {
    from {
        transform: translate3d(91vw, 102vh, 0);
    }
    to {
        transform: translate3d(38vw, -106vh, 0);
    }
}
.circle-container:nth-child(26) .circle {
    -webkit-animation-delay: 2263ms;
    animation-delay: 2263ms;
}
.circle-container:nth-child(27) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-27;
    animation-name: move-frames-27;
    -webkit-animation-duration: 35823ms;
    animation-duration: 35823ms;
    -webkit-animation-delay: 26789ms;
    animation-delay: 26789ms;
}
@-webkit-keyframes move-frames-27 {
    from {
        transform: translate3d(97vw, 104vh, 0);
    }
    to {
        transform: translate3d(92vw, -118vh, 0);
    }
}
@keyframes move-frames-27 {
    from {
        transform: translate3d(97vw, 104vh, 0);
    }
    to {
        transform: translate3d(92vw, -118vh, 0);
    }
}
.circle-container:nth-child(27) .circle {
    -webkit-animation-delay: 1993ms;
    animation-delay: 1993ms;
}
.circle-container:nth-child(28) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-28;
    animation-name: move-frames-28;
    -webkit-animation-duration: 32992ms;
    animation-duration: 32992ms;
    -webkit-animation-delay: 20654ms;
    animation-delay: 20654ms;
}
@-webkit-keyframes move-frames-28 {
    from {
        transform: translate3d(39vw, 102vh, 0);
    }
    to {
        transform: translate3d(56vw, -125vh, 0);
    }
}
@keyframes move-frames-28 {
    from {
        transform: translate3d(39vw, 102vh, 0);
    }
    to {
        transform: translate3d(56vw, -125vh, 0);
    }
}
.circle-container:nth-child(28) .circle {
    -webkit-animation-delay: 3433ms;
    animation-delay: 3433ms;
}
.circle-container:nth-child(29) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-29;
    animation-name: move-frames-29;
    -webkit-animation-duration: 35423ms;
    animation-duration: 35423ms;
    -webkit-animation-delay: 24769ms;
    animation-delay: 24769ms;
}
@-webkit-keyframes move-frames-29 {
    from {
        transform: translate3d(93vw, 110vh, 0);
    }
    to {
        transform: translate3d(51vw, -140vh, 0);
    }
}
@keyframes move-frames-29 {
    from {
        transform: translate3d(93vw, 110vh, 0);
    }
    to {
        transform: translate3d(51vw, -140vh, 0);
    }
}
.circle-container:nth-child(29) .circle {
    -webkit-animation-delay: 3139ms;
    animation-delay: 3139ms;
}
.circle-container:nth-child(30) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-30;
    animation-name: move-frames-30;
    -webkit-animation-duration: 35757ms;
    animation-duration: 35757ms;
    -webkit-animation-delay: 30804ms;
    animation-delay: 30804ms;
}
@-webkit-keyframes move-frames-30 {
    from {
        transform: translate3d(82vw, 101vh, 0);
    }
    to {
        transform: translate3d(29vw, -116vh, 0);
    }
}
@keyframes move-frames-30 {
    from {
        transform: translate3d(82vw, 101vh, 0);
    }
    to {
        transform: translate3d(29vw, -116vh, 0);
    }
}
.circle-container:nth-child(30) .circle {
    -webkit-animation-delay: 2961ms;
    animation-delay: 2961ms;
}
.circle-container:nth-child(31) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-31;
    animation-name: move-frames-31;
    -webkit-animation-duration: 34368ms;
    animation-duration: 34368ms;
    -webkit-animation-delay: 24492ms;
    animation-delay: 24492ms;
}
@-webkit-keyframes move-frames-31 {
    from {
        transform: translate3d(83vw, 104vh, 0);
    }
    to {
        transform: translate3d(32vw, -105vh, 0);
    }
}
@keyframes move-frames-31 {
    from {
        transform: translate3d(83vw, 104vh, 0);
    }
    to {
        transform: translate3d(32vw, -105vh, 0);
    }
}
.circle-container:nth-child(31) .circle {
    -webkit-animation-delay: 2838ms;
    animation-delay: 2838ms;
}
.circle-container:nth-child(32) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-32;
    animation-name: move-frames-32;
    -webkit-animation-duration: 29837ms;
    animation-duration: 29837ms;
    -webkit-animation-delay: 16139ms;
    animation-delay: 16139ms;
}
@-webkit-keyframes move-frames-32 {
    from {
        transform: translate3d(76vw, 103vh, 0);
    }
    to {
        transform: translate3d(34vw, -110vh, 0);
    }
}
@keyframes move-frames-32 {
    from {
        transform: translate3d(76vw, 103vh, 0);
    }
    to {
        transform: translate3d(34vw, -110vh, 0);
    }
}
.circle-container:nth-child(32) .circle {
    -webkit-animation-delay: 993ms;
    animation-delay: 993ms;
}
.circle-container:nth-child(33) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-33;
    animation-name: move-frames-33;
    -webkit-animation-duration: 31020ms;
    animation-duration: 31020ms;
    -webkit-animation-delay: 34269ms;
    animation-delay: 34269ms;
}
@-webkit-keyframes move-frames-33 {
    from {
        transform: translate3d(99vw, 101vh, 0);
    }
    to {
        transform: translate3d(68vw, -128vh, 0);
    }
}
@keyframes move-frames-33 {
    from {
        transform: translate3d(99vw, 101vh, 0);
    }
    to {
        transform: translate3d(68vw, -128vh, 0);
    }
}
.circle-container:nth-child(33) .circle {
    -webkit-animation-delay: 3570ms;
    animation-delay: 3570ms;
}
.circle-container:nth-child(34) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-34;
    animation-name: move-frames-34;
    -webkit-animation-duration: 31296ms;
    animation-duration: 31296ms;
    -webkit-animation-delay: 7523ms;
    animation-delay: 7523ms;
}
@-webkit-keyframes move-frames-34 {
    from {
        transform: translate3d(20vw, 101vh, 0);
    }
    to {
        transform: translate3d(8vw, -116vh, 0);
    }
}
@keyframes move-frames-34 {
    from {
        transform: translate3d(20vw, 101vh, 0);
    }
    to {
        transform: translate3d(8vw, -116vh, 0);
    }
}
.circle-container:nth-child(34) .circle {
    -webkit-animation-delay: 394ms;
    animation-delay: 394ms;
}
.circle-container:nth-child(35) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-35;
    animation-name: move-frames-35;
    -webkit-animation-duration: 36153ms;
    animation-duration: 36153ms;
    -webkit-animation-delay: 15163ms;
    animation-delay: 15163ms;
}
@-webkit-keyframes move-frames-35 {
    from {
        transform: translate3d(93vw, 102vh, 0);
    }
    to {
        transform: translate3d(38vw, -117vh, 0);
    }
}
@keyframes move-frames-35 {
    from {
        transform: translate3d(93vw, 102vh, 0);
    }
    to {
        transform: translate3d(38vw, -117vh, 0);
    }
}
.circle-container:nth-child(35) .circle {
    -webkit-animation-delay: 1038ms;
    animation-delay: 1038ms;
}
.circle-container:nth-child(36) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-36;
    animation-name: move-frames-36;
    -webkit-animation-duration: 29041ms;
    animation-duration: 29041ms;
    -webkit-animation-delay: 7251ms;
    animation-delay: 7251ms;
}
@-webkit-keyframes move-frames-36 {
    from {
        transform: translate3d(68vw, 108vh, 0);
    }
    to {
        transform: translate3d(5vw, -130vh, 0);
    }
}
@keyframes move-frames-36 {
    from {
        transform: translate3d(68vw, 108vh, 0);
    }
    to {
        transform: translate3d(5vw, -130vh, 0);
    }
}
.circle-container:nth-child(36) .circle {
    -webkit-animation-delay: 744ms;
    animation-delay: 744ms;
}
.circle-container:nth-child(37) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-37;
    animation-name: move-frames-37;
    -webkit-animation-duration: 35603ms;
    animation-duration: 35603ms;
    -webkit-animation-delay: 9862ms;
    animation-delay: 9862ms;
}
@-webkit-keyframes move-frames-37 {
    from {
        transform: translate3d(100vw, 105vh, 0);
    }
    to {
        transform: translate3d(72vw, -130vh, 0);
    }
}
@keyframes move-frames-37 {
    from {
        transform: translate3d(100vw, 105vh, 0);
    }
    to {
        transform: translate3d(72vw, -130vh, 0);
    }
}
.circle-container:nth-child(37) .circle {
    -webkit-animation-delay: 13ms;
    animation-delay: 13ms;
}
.circle-container:nth-child(38) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-38;
    animation-name: move-frames-38;
    -webkit-animation-duration: 34114ms;
    animation-duration: 34114ms;
    -webkit-animation-delay: 24929ms;
    animation-delay: 24929ms;
}
@-webkit-keyframes move-frames-38 {
    from {
        transform: translate3d(35vw, 104vh, 0);
    }
    to {
        transform: translate3d(25vw, -112vh, 0);
    }
}
@keyframes move-frames-38 {
    from {
        transform: translate3d(35vw, 104vh, 0);
    }
    to {
        transform: translate3d(25vw, -112vh, 0);
    }
}
.circle-container:nth-child(38) .circle {
    -webkit-animation-delay: 584ms;
    animation-delay: 584ms;
}
.circle-container:nth-child(39) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-39;
    animation-name: move-frames-39;
    -webkit-animation-duration: 33988ms;
    animation-duration: 33988ms;
    -webkit-animation-delay: 8365ms;
    animation-delay: 8365ms;
}
@-webkit-keyframes move-frames-39 {
    from {
        transform: translate3d(11vw, 102vh, 0);
    }
    to {
        transform: translate3d(83vw, -107vh, 0);
    }
}
@keyframes move-frames-39 {
    from {
        transform: translate3d(11vw, 102vh, 0);
    }
    to {
        transform: translate3d(83vw, -107vh, 0);
    }
}
.circle-container:nth-child(39) .circle {
    -webkit-animation-delay: 231ms;
    animation-delay: 231ms;
}
.circle-container:nth-child(40) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-40;
    animation-name: move-frames-40;
    -webkit-animation-duration: 33030ms;
    animation-duration: 33030ms;
    -webkit-animation-delay: 7148ms;
    animation-delay: 7148ms;
}
@-webkit-keyframes move-frames-40 {
    from {
        transform: translate3d(39vw, 106vh, 0);
    }
    to {
        transform: translate3d(62vw, -132vh, 0);
    }
}
@keyframes move-frames-40 {
    from {
        transform: translate3d(39vw, 106vh, 0);
    }
    to {
        transform: translate3d(62vw, -132vh, 0);
    }
}
.circle-container:nth-child(40) .circle {
    -webkit-animation-delay: 3030ms;
    animation-delay: 3030ms;
}
.circle-container:nth-child(41) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-41;
    animation-name: move-frames-41;
    -webkit-animation-duration: 33121ms;
    animation-duration: 33121ms;
    -webkit-animation-delay: 13117ms;
    animation-delay: 13117ms;
}
@-webkit-keyframes move-frames-41 {
    from {
        transform: translate3d(29vw, 103vh, 0);
    }
    to {
        transform: translate3d(49vw, -120vh, 0);
    }
}
@keyframes move-frames-41 {
    from {
        transform: translate3d(29vw, 103vh, 0);
    }
    to {
        transform: translate3d(49vw, -120vh, 0);
    }
}
.circle-container:nth-child(41) .circle {
    -webkit-animation-delay: 2606ms;
    animation-delay: 2606ms;
}
.circle-container:nth-child(42) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-42;
    animation-name: move-frames-42;
    -webkit-animation-duration: 31503ms;
    animation-duration: 31503ms;
    -webkit-animation-delay: 372ms;
    animation-delay: 372ms;
}
@-webkit-keyframes move-frames-42 {
    from {
        transform: translate3d(63vw, 103vh, 0);
    }
    to {
        transform: translate3d(59vw, -124vh, 0);
    }
}
@keyframes move-frames-42 {
    from {
        transform: translate3d(63vw, 103vh, 0);
    }
    to {
        transform: translate3d(59vw, -124vh, 0);
    }
}
.circle-container:nth-child(42) .circle {
    -webkit-animation-delay: 590ms;
    animation-delay: 590ms;
}
.circle-container:nth-child(43) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-43;
    animation-name: move-frames-43;
    -webkit-animation-duration: 31271ms;
    animation-duration: 31271ms;
    -webkit-animation-delay: 84ms;
    animation-delay: 84ms;
}
@-webkit-keyframes move-frames-43 {
    from {
        transform: translate3d(17vw, 102vh, 0);
    }
    to {
        transform: translate3d(41vw, -124vh, 0);
    }
}
@keyframes move-frames-43 {
    from {
        transform: translate3d(17vw, 102vh, 0);
    }
    to {
        transform: translate3d(41vw, -124vh, 0);
    }
}
.circle-container:nth-child(43) .circle {
    -webkit-animation-delay: 967ms;
    animation-delay: 967ms;
}
.circle-container:nth-child(44) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-44;
    animation-name: move-frames-44;
    -webkit-animation-duration: 30217ms;
    animation-duration: 30217ms;
    -webkit-animation-delay: 29897ms;
    animation-delay: 29897ms;
}
@-webkit-keyframes move-frames-44 {
    from {
        transform: translate3d(16vw, 110vh, 0);
    }
    to {
        transform: translate3d(71vw, -124vh, 0);
    }
}
@keyframes move-frames-44 {
    from {
        transform: translate3d(16vw, 110vh, 0);
    }
    to {
        transform: translate3d(71vw, -124vh, 0);
    }
}
.circle-container:nth-child(44) .circle {
    -webkit-animation-delay: 1784ms;
    animation-delay: 1784ms;
}
.circle-container:nth-child(45) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-45;
    animation-name: move-frames-45;
    -webkit-animation-duration: 28021ms;
    animation-duration: 28021ms;
    -webkit-animation-delay: 11567ms;
    animation-delay: 11567ms;
}
@-webkit-keyframes move-frames-45 {
    from {
        transform: translate3d(3vw, 106vh, 0);
    }
    to {
        transform: translate3d(42vw, -135vh, 0);
    }
}
@keyframes move-frames-45 {
    from {
        transform: translate3d(3vw, 106vh, 0);
    }
    to {
        transform: translate3d(42vw, -135vh, 0);
    }
}
.circle-container:nth-child(45) .circle {
    -webkit-animation-delay: 1258ms;
    animation-delay: 1258ms;
}
.circle-container:nth-child(46) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-46;
    animation-name: move-frames-46;
    -webkit-animation-duration: 35695ms;
    animation-duration: 35695ms;
    -webkit-animation-delay: 35703ms;
    animation-delay: 35703ms;
}
@-webkit-keyframes move-frames-46 {
    from {
        transform: translate3d(57vw, 109vh, 0);
    }
    to {
        transform: translate3d(72vw, -131vh, 0);
    }
}
@keyframes move-frames-46 {
    from {
        transform: translate3d(57vw, 109vh, 0);
    }
    to {
        transform: translate3d(72vw, -131vh, 0);
    }
}
.circle-container:nth-child(46) .circle {
    -webkit-animation-delay: 3477ms;
    animation-delay: 3477ms;
}
.circle-container:nth-child(47) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-47;
    animation-name: move-frames-47;
    -webkit-animation-duration: 31975ms;
    animation-duration: 31975ms;
    -webkit-animation-delay: 19114ms;
    animation-delay: 19114ms;
}
@-webkit-keyframes move-frames-47 {
    from {
        transform: translate3d(10vw, 107vh, 0);
    }
    to {
        transform: translate3d(76vw, -110vh, 0);
    }
}
@keyframes move-frames-47 {
    from {
        transform: translate3d(10vw, 107vh, 0);
    }
    to {
        transform: translate3d(76vw, -110vh, 0);
    }
}
.circle-container:nth-child(47) .circle {
    -webkit-animation-delay: 1800ms;
    animation-delay: 1800ms;
}
.circle-container:nth-child(48) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-48;
    animation-name: move-frames-48;
    -webkit-animation-duration: 31496ms;
    animation-duration: 31496ms;
    -webkit-animation-delay: 10190ms;
    animation-delay: 10190ms;
}
@-webkit-keyframes move-frames-48 {
    from {
        transform: translate3d(84vw, 110vh, 0);
    }
    to {
        transform: translate3d(41vw, -128vh, 0);
    }
}
@keyframes move-frames-48 {
    from {
        transform: translate3d(84vw, 110vh, 0);
    }
    to {
        transform: translate3d(41vw, -128vh, 0);
    }
}
.circle-container:nth-child(48) .circle {
    -webkit-animation-delay: 1270ms;
    animation-delay: 1270ms;
}
.circle-container:nth-child(49) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-49;
    animation-name: move-frames-49;
    -webkit-animation-duration: 33478ms;
    animation-duration: 33478ms;
    -webkit-animation-delay: 27484ms;
    animation-delay: 27484ms;
}
@-webkit-keyframes move-frames-49 {
    from {
        transform: translate3d(86vw, 104vh, 0);
    }
    to {
        transform: translate3d(49vw, -114vh, 0);
    }
}
@keyframes move-frames-49 {
    from {
        transform: translate3d(86vw, 104vh, 0);
    }
    to {
        transform: translate3d(49vw, -114vh, 0);
    }
}
.circle-container:nth-child(49) .circle {
    -webkit-animation-delay: 3719ms;
    animation-delay: 3719ms;
}
.circle-container:nth-child(50) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-50;
    animation-name: move-frames-50;
    -webkit-animation-duration: 29268ms;
    animation-duration: 29268ms;
    -webkit-animation-delay: 29947ms;
    animation-delay: 29947ms;
}
@-webkit-keyframes move-frames-50 {
    from {
        transform: translate3d(96vw, 107vh, 0);
    }
    to {
        transform: translate3d(53vw, -116vh, 0);
    }
}
@keyframes move-frames-50 {
    from {
        transform: translate3d(96vw, 107vh, 0);
    }
    to {
        transform: translate3d(53vw, -116vh, 0);
    }
}
.circle-container:nth-child(50) .circle {
    -webkit-animation-delay: 2485ms;
    animation-delay: 2485ms;
}
.circle-container:nth-child(51) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-51;
    animation-name: move-frames-51;
    -webkit-animation-duration: 36227ms;
    animation-duration: 36227ms;
    -webkit-animation-delay: 29995ms;
    animation-delay: 29995ms;
}
@-webkit-keyframes move-frames-51 {
    from {
        transform: translate3d(56vw, 104vh, 0);
    }
    to {
        transform: translate3d(84vw, -130vh, 0);
    }
}
@keyframes move-frames-51 {
    from {
        transform: translate3d(56vw, 104vh, 0);
    }
    to {
        transform: translate3d(84vw, -130vh, 0);
    }
}
.circle-container:nth-child(51) .circle {
    -webkit-animation-delay: 775ms;
    animation-delay: 775ms;
}
.circle-container:nth-child(52) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-52;
    animation-name: move-frames-52;
    -webkit-animation-duration: 34202ms;
    animation-duration: 34202ms;
    -webkit-animation-delay: 34747ms;
    animation-delay: 34747ms;
}
@-webkit-keyframes move-frames-52 {
    from {
        transform: translate3d(86vw, 109vh, 0);
    }
    to {
        transform: translate3d(70vw, -134vh, 0);
    }
}
@keyframes move-frames-52 {
    from {
        transform: translate3d(86vw, 109vh, 0);
    }
    to {
        transform: translate3d(70vw, -134vh, 0);
    }
}
.circle-container:nth-child(52) .circle {
    -webkit-animation-delay: 3028ms;
    animation-delay: 3028ms;
}
.circle-container:nth-child(53) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-53;
    animation-name: move-frames-53;
    -webkit-animation-duration: 36685ms;
    animation-duration: 36685ms;
    -webkit-animation-delay: 10157ms;
    animation-delay: 10157ms;
}
@-webkit-keyframes move-frames-53 {
    from {
        transform: translate3d(98vw, 110vh, 0);
    }
    to {
        transform: translate3d(83vw, -113vh, 0);
    }
}
@keyframes move-frames-53 {
    from {
        transform: translate3d(98vw, 110vh, 0);
    }
    to {
        transform: translate3d(83vw, -113vh, 0);
    }
}
.circle-container:nth-child(53) .circle {
    -webkit-animation-delay: 3978ms;
    animation-delay: 3978ms;
}
.circle-container:nth-child(54) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-54;
    animation-name: move-frames-54;
    -webkit-animation-duration: 30308ms;
    animation-duration: 30308ms;
    -webkit-animation-delay: 19470ms;
    animation-delay: 19470ms;
}
@-webkit-keyframes move-frames-54 {
    from {
        transform: translate3d(21vw, 106vh, 0);
    }
    to {
        transform: translate3d(90vw, -123vh, 0);
    }
}
@keyframes move-frames-54 {
    from {
        transform: translate3d(21vw, 106vh, 0);
    }
    to {
        transform: translate3d(90vw, -123vh, 0);
    }
}
.circle-container:nth-child(54) .circle {
    -webkit-animation-delay: 1021ms;
    animation-delay: 1021ms;
}
.circle-container:nth-child(55) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-55;
    animation-name: move-frames-55;
    -webkit-animation-duration: 36069ms;
    animation-duration: 36069ms;
    -webkit-animation-delay: 34319ms;
    animation-delay: 34319ms;
}
@-webkit-keyframes move-frames-55 {
    from {
        transform: translate3d(19vw, 107vh, 0);
    }
    to {
        transform: translate3d(86vw, -124vh, 0);
    }
}
@keyframes move-frames-55 {
    from {
        transform: translate3d(19vw, 107vh, 0);
    }
    to {
        transform: translate3d(86vw, -124vh, 0);
    }
}
.circle-container:nth-child(55) .circle {
    -webkit-animation-delay: 3825ms;
    animation-delay: 3825ms;
}
.circle-container:nth-child(56) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-56;
    animation-name: move-frames-56;
    -webkit-animation-duration: 33029ms;
    animation-duration: 33029ms;
    -webkit-animation-delay: 25328ms;
    animation-delay: 25328ms;
}
@-webkit-keyframes move-frames-56 {
    from {
        transform: translate3d(22vw, 101vh, 0);
    }
    to {
        transform: translate3d(73vw, -109vh, 0);
    }
}
@keyframes move-frames-56 {
    from {
        transform: translate3d(22vw, 101vh, 0);
    }
    to {
        transform: translate3d(73vw, -109vh, 0);
    }
}
.circle-container:nth-child(56) .circle {
    -webkit-animation-delay: 1034ms;
    animation-delay: 1034ms;
}
.circle-container:nth-child(57) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-57;
    animation-name: move-frames-57;
    -webkit-animation-duration: 36348ms;
    animation-duration: 36348ms;
    -webkit-animation-delay: 6938ms;
    animation-delay: 6938ms;
}
@-webkit-keyframes move-frames-57 {
    from {
        transform: translate3d(78vw, 104vh, 0);
    }
    to {
        transform: translate3d(33vw, -115vh, 0);
    }
}
@keyframes move-frames-57 {
    from {
        transform: translate3d(78vw, 104vh, 0);
    }
    to {
        transform: translate3d(33vw, -115vh, 0);
    }
}
.circle-container:nth-child(57) .circle {
    -webkit-animation-delay: 2181ms;
    animation-delay: 2181ms;
}
.circle-container:nth-child(58) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-58;
    animation-name: move-frames-58;
    -webkit-animation-duration: 36417ms;
    animation-duration: 36417ms;
    -webkit-animation-delay: 17312ms;
    animation-delay: 17312ms;
}
@-webkit-keyframes move-frames-58 {
    from {
        transform: translate3d(64vw, 101vh, 0);
    }
    to {
        transform: translate3d(61vw, -129vh, 0);
    }
}
@keyframes move-frames-58 {
    from {
        transform: translate3d(64vw, 101vh, 0);
    }
    to {
        transform: translate3d(61vw, -129vh, 0);
    }
}
.circle-container:nth-child(58) .circle {
    -webkit-animation-delay: 2678ms;
    animation-delay: 2678ms;
}
.circle-container:nth-child(59) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-59;
    animation-name: move-frames-59;
    -webkit-animation-duration: 33056ms;
    animation-duration: 33056ms;
    -webkit-animation-delay: 13087ms;
    animation-delay: 13087ms;
}
@-webkit-keyframes move-frames-59 {
    from {
        transform: translate3d(47vw, 107vh, 0);
    }
    to {
        transform: translate3d(71vw, -125vh, 0);
    }
}
@keyframes move-frames-59 {
    from {
        transform: translate3d(47vw, 107vh, 0);
    }
    to {
        transform: translate3d(71vw, -125vh, 0);
    }
}
.circle-container:nth-child(59) .circle {
    -webkit-animation-delay: 483ms;
    animation-delay: 483ms;
}
.circle-container:nth-child(60) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-60;
    animation-name: move-frames-60;
    -webkit-animation-duration: 32818ms;
    animation-duration: 32818ms;
    -webkit-animation-delay: 14647ms;
    animation-delay: 14647ms;
}
@-webkit-keyframes move-frames-60 {
    from {
        transform: translate3d(65vw, 103vh, 0);
    }
    to {
        transform: translate3d(39vw, -117vh, 0);
    }
}
@keyframes move-frames-60 {
    from {
        transform: translate3d(65vw, 103vh, 0);
    }
    to {
        transform: translate3d(39vw, -117vh, 0);
    }
}
.circle-container:nth-child(60) .circle {
    -webkit-animation-delay: 2972ms;
    animation-delay: 2972ms;
}
.circle-container:nth-child(61) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-61;
    animation-name: move-frames-61;
    -webkit-animation-duration: 32585ms;
    animation-duration: 32585ms;
    -webkit-animation-delay: 36283ms;
    animation-delay: 36283ms;
}
@-webkit-keyframes move-frames-61 {
    from {
        transform: translate3d(45vw, 107vh, 0);
    }
    to {
        transform: translate3d(3vw, -119vh, 0);
    }
}
@keyframes move-frames-61 {
    from {
        transform: translate3d(45vw, 107vh, 0);
    }
    to {
        transform: translate3d(3vw, -119vh, 0);
    }
}
.circle-container:nth-child(61) .circle {
    -webkit-animation-delay: 412ms;
    animation-delay: 412ms;
}
.circle-container:nth-child(62) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-62;
    animation-name: move-frames-62;
    -webkit-animation-duration: 28649ms;
    animation-duration: 28649ms;
    -webkit-animation-delay: 25976ms;
    animation-delay: 25976ms;
}
@-webkit-keyframes move-frames-62 {
    from {
        transform: translate3d(95vw, 102vh, 0);
    }
    to {
        transform: translate3d(70vw, -114vh, 0);
    }
}
@keyframes move-frames-62 {
    from {
        transform: translate3d(95vw, 102vh, 0);
    }
    to {
        transform: translate3d(70vw, -114vh, 0);
    }
}
.circle-container:nth-child(62) .circle {
    -webkit-animation-delay: 1661ms;
    animation-delay: 1661ms;
}
.circle-container:nth-child(63) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-63;
    animation-name: move-frames-63;
    -webkit-animation-duration: 28184ms;
    animation-duration: 28184ms;
    -webkit-animation-delay: 26272ms;
    animation-delay: 26272ms;
}
@-webkit-keyframes move-frames-63 {
    from {
        transform: translate3d(3vw, 107vh, 0);
    }
    to {
        transform: translate3d(46vw, -120vh, 0);
    }
}
@keyframes move-frames-63 {
    from {
        transform: translate3d(3vw, 107vh, 0);
    }
    to {
        transform: translate3d(46vw, -120vh, 0);
    }
}
.circle-container:nth-child(63) .circle {
    -webkit-animation-delay: 3333ms;
    animation-delay: 3333ms;
}
.circle-container:nth-child(64) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-64;
    animation-name: move-frames-64;
    -webkit-animation-duration: 30029ms;
    animation-duration: 30029ms;
    -webkit-animation-delay: 8728ms;
    animation-delay: 8728ms;
}
@-webkit-keyframes move-frames-64 {
    from {
        transform: translate3d(7vw, 101vh, 0);
    }
    to {
        transform: translate3d(36vw, -112vh, 0);
    }
}
@keyframes move-frames-64 {
    from {
        transform: translate3d(7vw, 101vh, 0);
    }
    to {
        transform: translate3d(36vw, -112vh, 0);
    }
}
.circle-container:nth-child(64) .circle {
    -webkit-animation-delay: 542ms;
    animation-delay: 542ms;
}
.circle-container:nth-child(65) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-65;
    animation-name: move-frames-65;
    -webkit-animation-duration: 29544ms;
    animation-duration: 29544ms;
    -webkit-animation-delay: 14230ms;
    animation-delay: 14230ms;
}
@-webkit-keyframes move-frames-65 {
    from {
        transform: translate3d(19vw, 102vh, 0);
    }
    to {
        transform: translate3d(8vw, -132vh, 0);
    }
}
@keyframes move-frames-65 {
    from {
        transform: translate3d(19vw, 102vh, 0);
    }
    to {
        transform: translate3d(8vw, -132vh, 0);
    }
}
.circle-container:nth-child(65) .circle {
    -webkit-animation-delay: 2970ms;
    animation-delay: 2970ms;
}
.circle-container:nth-child(66) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-66;
    animation-name: move-frames-66;
    -webkit-animation-duration: 33742ms;
    animation-duration: 33742ms;
    -webkit-animation-delay: 3794ms;
    animation-delay: 3794ms;
}
@-webkit-keyframes move-frames-66 {
    from {
        transform: translate3d(17vw, 107vh, 0);
    }
    to {
        transform: translate3d(13vw, -114vh, 0);
    }
}
@keyframes move-frames-66 {
    from {
        transform: translate3d(17vw, 107vh, 0);
    }
    to {
        transform: translate3d(13vw, -114vh, 0);
    }
}
.circle-container:nth-child(66) .circle {
    -webkit-animation-delay: 171ms;
    animation-delay: 171ms;
}
.circle-container:nth-child(67) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-67;
    animation-name: move-frames-67;
    -webkit-animation-duration: 32168ms;
    animation-duration: 32168ms;
    -webkit-animation-delay: 4463ms;
    animation-delay: 4463ms;
}
@-webkit-keyframes move-frames-67 {
    from {
        transform: translate3d(3vw, 103vh, 0);
    }
    to {
        transform: translate3d(26vw, -104vh, 0);
    }
}
@keyframes move-frames-67 {
    from {
        transform: translate3d(3vw, 103vh, 0);
    }
    to {
        transform: translate3d(26vw, -104vh, 0);
    }
}
.circle-container:nth-child(67) .circle {
    -webkit-animation-delay: 3480ms;
    animation-delay: 3480ms;
}
.circle-container:nth-child(68) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-68;
    animation-name: move-frames-68;
    -webkit-animation-duration: 31421ms;
    animation-duration: 31421ms;
    -webkit-animation-delay: 8136ms;
    animation-delay: 8136ms;
}
@-webkit-keyframes move-frames-68 {
    from {
        transform: translate3d(54vw, 103vh, 0);
    }
    to {
        transform: translate3d(100vw, -126vh, 0);
    }
}
@keyframes move-frames-68 {
    from {
        transform: translate3d(54vw, 103vh, 0);
    }
    to {
        transform: translate3d(100vw, -126vh, 0);
    }
}
.circle-container:nth-child(68) .circle {
    -webkit-animation-delay: 2767ms;
    animation-delay: 2767ms;
}
.circle-container:nth-child(69) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-69;
    animation-name: move-frames-69;
    -webkit-animation-duration: 32766ms;
    animation-duration: 32766ms;
    -webkit-animation-delay: 24284ms;
    animation-delay: 24284ms;
}
@-webkit-keyframes move-frames-69 {
    from {
        transform: translate3d(24vw, 107vh, 0);
    }
    to {
        transform: translate3d(20vw, -112vh, 0);
    }
}
@keyframes move-frames-69 {
    from {
        transform: translate3d(24vw, 107vh, 0);
    }
    to {
        transform: translate3d(20vw, -112vh, 0);
    }
}
.circle-container:nth-child(69) .circle {
    -webkit-animation-delay: 1651ms;
    animation-delay: 1651ms;
}
.circle-container:nth-child(70) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-70;
    animation-name: move-frames-70;
    -webkit-animation-duration: 34070ms;
    animation-duration: 34070ms;
    -webkit-animation-delay: 747ms;
    animation-delay: 747ms;
}
@-webkit-keyframes move-frames-70 {
    from {
        transform: translate3d(45vw, 102vh, 0);
    }
    to {
        transform: translate3d(92vw, -121vh, 0);
    }
}
@keyframes move-frames-70 {
    from {
        transform: translate3d(45vw, 102vh, 0);
    }
    to {
        transform: translate3d(92vw, -121vh, 0);
    }
}
.circle-container:nth-child(70) .circle {
    -webkit-animation-delay: 3545ms;
    animation-delay: 3545ms;
}
.circle-container:nth-child(71) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-71;
    animation-name: move-frames-71;
    -webkit-animation-duration: 31625ms;
    animation-duration: 31625ms;
    -webkit-animation-delay: 31707ms;
    animation-delay: 31707ms;
}
@-webkit-keyframes move-frames-71 {
    from {
        transform: translate3d(72vw, 104vh, 0);
    }
    to {
        transform: translate3d(29vw, -119vh, 0);
    }
}
@keyframes move-frames-71 {
    from {
        transform: translate3d(72vw, 104vh, 0);
    }
    to {
        transform: translate3d(29vw, -119vh, 0);
    }
}
.circle-container:nth-child(71) .circle {
    -webkit-animation-delay: 2788ms;
    animation-delay: 2788ms;
}
.circle-container:nth-child(72) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-72;
    animation-name: move-frames-72;
    -webkit-animation-duration: 35568ms;
    animation-duration: 35568ms;
    -webkit-animation-delay: 2573ms;
    animation-delay: 2573ms;
}
@-webkit-keyframes move-frames-72 {
    from {
        transform: translate3d(61vw, 101vh, 0);
    }
    to {
        transform: translate3d(43vw, -130vh, 0);
    }
}
@keyframes move-frames-72 {
    from {
        transform: translate3d(61vw, 101vh, 0);
    }
    to {
        transform: translate3d(43vw, -130vh, 0);
    }
}
.circle-container:nth-child(72) .circle {
    -webkit-animation-delay: 284ms;
    animation-delay: 284ms;
}
.circle-container:nth-child(73) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-73;
    animation-name: move-frames-73;
    -webkit-animation-duration: 28188ms;
    animation-duration: 28188ms;
    -webkit-animation-delay: 9015ms;
    animation-delay: 9015ms;
}
@-webkit-keyframes move-frames-73 {
    from {
        transform: translate3d(69vw, 103vh, 0);
    }
    to {
        transform: translate3d(51vw, -126vh, 0);
    }
}
@keyframes move-frames-73 {
    from {
        transform: translate3d(69vw, 103vh, 0);
    }
    to {
        transform: translate3d(51vw, -126vh, 0);
    }
}
.circle-container:nth-child(73) .circle {
    -webkit-animation-delay: 3293ms;
    animation-delay: 3293ms;
}
.circle-container:nth-child(74) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-74;
    animation-name: move-frames-74;
    -webkit-animation-duration: 32964ms;
    animation-duration: 32964ms;
    -webkit-animation-delay: 23789ms;
    animation-delay: 23789ms;
}
@-webkit-keyframes move-frames-74 {
    from {
        transform: translate3d(43vw, 106vh, 0);
    }
    to {
        transform: translate3d(16vw, -127vh, 0);
    }
}
@keyframes move-frames-74 {
    from {
        transform: translate3d(43vw, 106vh, 0);
    }
    to {
        transform: translate3d(16vw, -127vh, 0);
    }
}
.circle-container:nth-child(74) .circle {
    -webkit-animation-delay: 516ms;
    animation-delay: 516ms;
}
.circle-container:nth-child(75) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-75;
    animation-name: move-frames-75;
    -webkit-animation-duration: 36137ms;
    animation-duration: 36137ms;
    -webkit-animation-delay: 26292ms;
    animation-delay: 26292ms;
}
@-webkit-keyframes move-frames-75 {
    from {
        transform: translate3d(34vw, 105vh, 0);
    }
    to {
        transform: translate3d(48vw, -121vh, 0);
    }
}
@keyframes move-frames-75 {
    from {
        transform: translate3d(34vw, 105vh, 0);
    }
    to {
        transform: translate3d(48vw, -121vh, 0);
    }
}
.circle-container:nth-child(75) .circle {
    -webkit-animation-delay: 3276ms;
    animation-delay: 3276ms;
}
.circle-container:nth-child(76) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-76;
    animation-name: move-frames-76;
    -webkit-animation-duration: 36121ms;
    animation-duration: 36121ms;
    -webkit-animation-delay: 36156ms;
    animation-delay: 36156ms;
}
@-webkit-keyframes move-frames-76 {
    from {
        transform: translate3d(47vw, 105vh, 0);
    }
    to {
        transform: translate3d(14vw, -135vh, 0);
    }
}
@keyframes move-frames-76 {
    from {
        transform: translate3d(47vw, 105vh, 0);
    }
    to {
        transform: translate3d(14vw, -135vh, 0);
    }
}
.circle-container:nth-child(76) .circle {
    -webkit-animation-delay: 2714ms;
    animation-delay: 2714ms;
}
.circle-container:nth-child(77) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-77;
    animation-name: move-frames-77;
    -webkit-animation-duration: 29418ms;
    animation-duration: 29418ms;
    -webkit-animation-delay: 1024ms;
    animation-delay: 1024ms;
}
@-webkit-keyframes move-frames-77 {
    from {
        transform: translate3d(75vw, 105vh, 0);
    }
    to {
        transform: translate3d(3vw, -121vh, 0);
    }
}
@keyframes move-frames-77 {
    from {
        transform: translate3d(75vw, 105vh, 0);
    }
    to {
        transform: translate3d(3vw, -121vh, 0);
    }
}
.circle-container:nth-child(77) .circle {
    -webkit-animation-delay: 3774ms;
    animation-delay: 3774ms;
}
.circle-container:nth-child(78) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-78;
    animation-name: move-frames-78;
    -webkit-animation-duration: 34130ms;
    animation-duration: 34130ms;
    -webkit-animation-delay: 1492ms;
    animation-delay: 1492ms;
}
@-webkit-keyframes move-frames-78 {
    from {
        transform: translate3d(8vw, 103vh, 0);
    }
    to {
        transform: translate3d(26vw, -114vh, 0);
    }
}
@keyframes move-frames-78 {
    from {
        transform: translate3d(8vw, 103vh, 0);
    }
    to {
        transform: translate3d(26vw, -114vh, 0);
    }
}
.circle-container:nth-child(78) .circle {
    -webkit-animation-delay: 3269ms;
    animation-delay: 3269ms;
}
.circle-container:nth-child(79) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-79;
    animation-name: move-frames-79;
    -webkit-animation-duration: 34462ms;
    animation-duration: 34462ms;
    -webkit-animation-delay: 19265ms;
    animation-delay: 19265ms;
}
@-webkit-keyframes move-frames-79 {
    from {
        transform: translate3d(2vw, 105vh, 0);
    }
    to {
        transform: translate3d(92vw, -113vh, 0);
    }
}
@keyframes move-frames-79 {
    from {
        transform: translate3d(2vw, 105vh, 0);
    }
    to {
        transform: translate3d(92vw, -113vh, 0);
    }
}
.circle-container:nth-child(79) .circle {
    -webkit-animation-delay: 1697ms;
    animation-delay: 1697ms;
}
.circle-container:nth-child(80) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-80;
    animation-name: move-frames-80;
    -webkit-animation-duration: 31917ms;
    animation-duration: 31917ms;
    -webkit-animation-delay: 27674ms;
    animation-delay: 27674ms;
}
@-webkit-keyframes move-frames-80 {
    from {
        transform: translate3d(57vw, 109vh, 0);
    }
    to {
        transform: translate3d(34vw, -138vh, 0);
    }
}
@keyframes move-frames-80 {
    from {
        transform: translate3d(57vw, 109vh, 0);
    }
    to {
        transform: translate3d(34vw, -138vh, 0);
    }
}
.circle-container:nth-child(80) .circle {
    -webkit-animation-delay: 1941ms;
    animation-delay: 1941ms;
}
.circle-container:nth-child(81) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-81;
    animation-name: move-frames-81;
    -webkit-animation-duration: 32984ms;
    animation-duration: 32984ms;
    -webkit-animation-delay: 35895ms;
    animation-delay: 35895ms;
}
@-webkit-keyframes move-frames-81 {
    from {
        transform: translate3d(71vw, 101vh, 0);
    }
    to {
        transform: translate3d(100vw, -116vh, 0);
    }
}
@keyframes move-frames-81 {
    from {
        transform: translate3d(71vw, 101vh, 0);
    }
    to {
        transform: translate3d(100vw, -116vh, 0);
    }
}
.circle-container:nth-child(81) .circle {
    -webkit-animation-delay: 58ms;
    animation-delay: 58ms;
}
.circle-container:nth-child(82) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-82;
    animation-name: move-frames-82;
    -webkit-animation-duration: 31380ms;
    animation-duration: 31380ms;
    -webkit-animation-delay: 2861ms;
    animation-delay: 2861ms;
}
@-webkit-keyframes move-frames-82 {
    from {
        transform: translate3d(96vw, 107vh, 0);
    }
    to {
        transform: translate3d(8vw, -127vh, 0);
    }
}
@keyframes move-frames-82 {
    from {
        transform: translate3d(96vw, 107vh, 0);
    }
    to {
        transform: translate3d(8vw, -127vh, 0);
    }
}
.circle-container:nth-child(82) .circle {
    -webkit-animation-delay: 1891ms;
    animation-delay: 1891ms;
}
.circle-container:nth-child(83) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-83;
    animation-name: move-frames-83;
    -webkit-animation-duration: 34609ms;
    animation-duration: 34609ms;
    -webkit-animation-delay: 19969ms;
    animation-delay: 19969ms;
}
@-webkit-keyframes move-frames-83 {
    from {
        transform: translate3d(82vw, 109vh, 0);
    }
    to {
        transform: translate3d(11vw, -114vh, 0);
    }
}
@keyframes move-frames-83 {
    from {
        transform: translate3d(82vw, 109vh, 0);
    }
    to {
        transform: translate3d(11vw, -114vh, 0);
    }
}
.circle-container:nth-child(83) .circle {
    -webkit-animation-delay: 862ms;
    animation-delay: 862ms;
}
.circle-container:nth-child(84) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-84;
    animation-name: move-frames-84;
    -webkit-animation-duration: 32462ms;
    animation-duration: 32462ms;
    -webkit-animation-delay: 135ms;
    animation-delay: 135ms;
}
@-webkit-keyframes move-frames-84 {
    from {
        transform: translate3d(15vw, 108vh, 0);
    }
    to {
        transform: translate3d(27vw, -128vh, 0);
    }
}
@keyframes move-frames-84 {
    from {
        transform: translate3d(15vw, 108vh, 0);
    }
    to {
        transform: translate3d(27vw, -128vh, 0);
    }
}
.circle-container:nth-child(84) .circle {
    -webkit-animation-delay: 3429ms;
    animation-delay: 3429ms;
}
.circle-container:nth-child(85) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-85;
    animation-name: move-frames-85;
    -webkit-animation-duration: 33103ms;
    animation-duration: 33103ms;
    -webkit-animation-delay: 32688ms;
    animation-delay: 32688ms;
}
@-webkit-keyframes move-frames-85 {
    from {
        transform: translate3d(2vw, 110vh, 0);
    }
    to {
        transform: translate3d(69vw, -125vh, 0);
    }
}
@keyframes move-frames-85 {
    from {
        transform: translate3d(2vw, 110vh, 0);
    }
    to {
        transform: translate3d(69vw, -125vh, 0);
    }
}
.circle-container:nth-child(85) .circle {
    -webkit-animation-delay: 1679ms;
    animation-delay: 1679ms;
}
.circle-container:nth-child(86) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-86;
    animation-name: move-frames-86;
    -webkit-animation-duration: 34884ms;
    animation-duration: 34884ms;
    -webkit-animation-delay: 2125ms;
    animation-delay: 2125ms;
}
@-webkit-keyframes move-frames-86 {
    from {
        transform: translate3d(34vw, 106vh, 0);
    }
    to {
        transform: translate3d(34vw, -116vh, 0);
    }
}
@keyframes move-frames-86 {
    from {
        transform: translate3d(34vw, 106vh, 0);
    }
    to {
        transform: translate3d(34vw, -116vh, 0);
    }
}
.circle-container:nth-child(86) .circle {
    -webkit-animation-delay: 888ms;
    animation-delay: 888ms;
}
.circle-container:nth-child(87) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-87;
    animation-name: move-frames-87;
    -webkit-animation-duration: 30965ms;
    animation-duration: 30965ms;
    -webkit-animation-delay: 7304ms;
    animation-delay: 7304ms;
}
@-webkit-keyframes move-frames-87 {
    from {
        transform: translate3d(87vw, 105vh, 0);
    }
    to {
        transform: translate3d(40vw, -113vh, 0);
    }
}
@keyframes move-frames-87 {
    from {
        transform: translate3d(87vw, 105vh, 0);
    }
    to {
        transform: translate3d(40vw, -113vh, 0);
    }
}
.circle-container:nth-child(87) .circle {
    -webkit-animation-delay: 1464ms;
    animation-delay: 1464ms;
}
.circle-container:nth-child(88) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-88;
    animation-name: move-frames-88;
    -webkit-animation-duration: 29060ms;
    animation-duration: 29060ms;
    -webkit-animation-delay: 34178ms;
    animation-delay: 34178ms;
}
@-webkit-keyframes move-frames-88 {
    from {
        transform: translate3d(64vw, 110vh, 0);
    }
    to {
        transform: translate3d(71vw, -126vh, 0);
    }
}
@keyframes move-frames-88 {
    from {
        transform: translate3d(64vw, 110vh, 0);
    }
    to {
        transform: translate3d(71vw, -126vh, 0);
    }
}
.circle-container:nth-child(88) .circle {
    -webkit-animation-delay: 1629ms;
    animation-delay: 1629ms;
}
.circle-container:nth-child(89) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-89;
    animation-name: move-frames-89;
    -webkit-animation-duration: 33804ms;
    animation-duration: 33804ms;
    -webkit-animation-delay: 1836ms;
    animation-delay: 1836ms;
}
@-webkit-keyframes move-frames-89 {
    from {
        transform: translate3d(71vw, 103vh, 0);
    }
    to {
        transform: translate3d(92vw, -133vh, 0);
    }
}
@keyframes move-frames-89 {
    from {
        transform: translate3d(71vw, 103vh, 0);
    }
    to {
        transform: translate3d(92vw, -133vh, 0);
    }
}
.circle-container:nth-child(89) .circle {
    -webkit-animation-delay: 2635ms;
    animation-delay: 2635ms;
}
.circle-container:nth-child(90) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-90;
    animation-name: move-frames-90;
    -webkit-animation-duration: 34578ms;
    animation-duration: 34578ms;
    -webkit-animation-delay: 32602ms;
    animation-delay: 32602ms;
}
@-webkit-keyframes move-frames-90 {
    from {
        transform: translate3d(85vw, 108vh, 0);
    }
    to {
        transform: translate3d(81vw, -124vh, 0);
    }
}
@keyframes move-frames-90 {
    from {
        transform: translate3d(85vw, 108vh, 0);
    }
    to {
        transform: translate3d(81vw, -124vh, 0);
    }
}
.circle-container:nth-child(90) .circle {
    -webkit-animation-delay: 3141ms;
    animation-delay: 3141ms;
}
.circle-container:nth-child(91) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-91;
    animation-name: move-frames-91;
    -webkit-animation-duration: 34271ms;
    animation-duration: 34271ms;
    -webkit-animation-delay: 9662ms;
    animation-delay: 9662ms;
}
@-webkit-keyframes move-frames-91 {
    from {
        transform: translate3d(51vw, 110vh, 0);
    }
    to {
        transform: translate3d(86vw, -117vh, 0);
    }
}
@keyframes move-frames-91 {
    from {
        transform: translate3d(51vw, 110vh, 0);
    }
    to {
        transform: translate3d(86vw, -117vh, 0);
    }
}
.circle-container:nth-child(91) .circle {
    -webkit-animation-delay: 2831ms;
    animation-delay: 2831ms;
}
.circle-container:nth-child(92) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-92;
    animation-name: move-frames-92;
    -webkit-animation-duration: 35937ms;
    animation-duration: 35937ms;
    -webkit-animation-delay: 32837ms;
    animation-delay: 32837ms;
}
@-webkit-keyframes move-frames-92 {
    from {
        transform: translate3d(26vw, 102vh, 0);
    }
    to {
        transform: translate3d(76vw, -130vh, 0);
    }
}
@keyframes move-frames-92 {
    from {
        transform: translate3d(26vw, 102vh, 0);
    }
    to {
        transform: translate3d(76vw, -130vh, 0);
    }
}
.circle-container:nth-child(92) .circle {
    -webkit-animation-delay: 2404ms;
    animation-delay: 2404ms;
}
.circle-container:nth-child(93) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-93;
    animation-name: move-frames-93;
    -webkit-animation-duration: 33067ms;
    animation-duration: 33067ms;
    -webkit-animation-delay: 13149ms;
    animation-delay: 13149ms;
}
@-webkit-keyframes move-frames-93 {
    from {
        transform: translate3d(75vw, 105vh, 0);
    }
    to {
        transform: translate3d(18vw, -121vh, 0);
    }
}
@keyframes move-frames-93 {
    from {
        transform: translate3d(75vw, 105vh, 0);
    }
    to {
        transform: translate3d(18vw, -121vh, 0);
    }
}
.circle-container:nth-child(93) .circle {
    -webkit-animation-delay: 1478ms;
    animation-delay: 1478ms;
}
.circle-container:nth-child(94) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-94;
    animation-name: move-frames-94;
    -webkit-animation-duration: 30817ms;
    animation-duration: 30817ms;
    -webkit-animation-delay: 12439ms;
    animation-delay: 12439ms;
}
@-webkit-keyframes move-frames-94 {
    from {
        transform: translate3d(56vw, 101vh, 0);
    }
    to {
        transform: translate3d(36vw, -131vh, 0);
    }
}
@keyframes move-frames-94 {
    from {
        transform: translate3d(56vw, 101vh, 0);
    }
    to {
        transform: translate3d(36vw, -131vh, 0);
    }
}
.circle-container:nth-child(94) .circle {
    -webkit-animation-delay: 2794ms;
    animation-delay: 2794ms;
}
.circle-container:nth-child(95) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-95;
    animation-name: move-frames-95;
    -webkit-animation-duration: 36186ms;
    animation-duration: 36186ms;
    -webkit-animation-delay: 27114ms;
    animation-delay: 27114ms;
}
@-webkit-keyframes move-frames-95 {
    from {
        transform: translate3d(18vw, 104vh, 0);
    }
    to {
        transform: translate3d(29vw, -123vh, 0);
    }
}
@keyframes move-frames-95 {
    from {
        transform: translate3d(18vw, 104vh, 0);
    }
    to {
        transform: translate3d(29vw, -123vh, 0);
    }
}
.circle-container:nth-child(95) .circle {
    -webkit-animation-delay: 2404ms;
    animation-delay: 2404ms;
}
.circle-container:nth-child(96) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-96;
    animation-name: move-frames-96;
    -webkit-animation-duration: 34708ms;
    animation-duration: 34708ms;
    -webkit-animation-delay: 16197ms;
    animation-delay: 16197ms;
}
@-webkit-keyframes move-frames-96 {
    from {
        transform: translate3d(58vw, 107vh, 0);
    }
    to {
        transform: translate3d(2vw, -135vh, 0);
    }
}
@keyframes move-frames-96 {
    from {
        transform: translate3d(58vw, 107vh, 0);
    }
    to {
        transform: translate3d(2vw, -135vh, 0);
    }
}
.circle-container:nth-child(96) .circle {
    -webkit-animation-delay: 1071ms;
    animation-delay: 1071ms;
}
.circle-container:nth-child(97) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-97;
    animation-name: move-frames-97;
    -webkit-animation-duration: 34150ms;
    animation-duration: 34150ms;
    -webkit-animation-delay: 19321ms;
    animation-delay: 19321ms;
}
@-webkit-keyframes move-frames-97 {
    from {
        transform: translate3d(13vw, 105vh, 0);
    }
    to {
        transform: translate3d(52vw, -128vh, 0);
    }
}
@keyframes move-frames-97 {
    from {
        transform: translate3d(13vw, 105vh, 0);
    }
    to {
        transform: translate3d(52vw, -128vh, 0);
    }
}
.circle-container:nth-child(97) .circle {
    -webkit-animation-delay: 2037ms;
    animation-delay: 2037ms;
}
.circle-container:nth-child(98) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-98;
    animation-name: move-frames-98;
    -webkit-animation-duration: 34704ms;
    animation-duration: 34704ms;
    -webkit-animation-delay: 18942ms;
    animation-delay: 18942ms;
}
@-webkit-keyframes move-frames-98 {
    from {
        transform: translate3d(46vw, 108vh, 0);
    }
    to {
        transform: translate3d(76vw, -126vh, 0);
    }
}
@keyframes move-frames-98 {
    from {
        transform: translate3d(46vw, 108vh, 0);
    }
    to {
        transform: translate3d(76vw, -126vh, 0);
    }
}
.circle-container:nth-child(98) .circle {
    -webkit-animation-delay: 1079ms;
    animation-delay: 1079ms;
}
.circle-container:nth-child(99) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-99;
    animation-name: move-frames-99;
    -webkit-animation-duration: 30088ms;
    animation-duration: 30088ms;
    -webkit-animation-delay: 19692ms;
    animation-delay: 19692ms;
}
@-webkit-keyframes move-frames-99 {
    from {
        transform: translate3d(12vw, 103vh, 0);
    }
    to {
        transform: translate3d(55vw, -126vh, 0);
    }
}
@keyframes move-frames-99 {
    from {
        transform: translate3d(12vw, 103vh, 0);
    }
    to {
        transform: translate3d(55vw, -126vh, 0);
    }
}
.circle-container:nth-child(99) .circle {
    -webkit-animation-delay: 2007ms;
    animation-delay: 2007ms;
}
.circle-container:nth-child(100) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-100;
    animation-name: move-frames-100;
    -webkit-animation-duration: 32167ms;
    animation-duration: 32167ms;
    -webkit-animation-delay: 30620ms;
    animation-delay: 30620ms;
}
@-webkit-keyframes move-frames-100 {
    from {
        transform: translate3d(60vw, 103vh, 0);
    }
    to {
        transform: translate3d(9vw, -107vh, 0);
    }
}
@keyframes move-frames-100 {
    from {
        transform: translate3d(60vw, 103vh, 0);
    }
    to {
        transform: translate3d(9vw, -107vh, 0);
    }
}
.circle-container:nth-child(100) .circle {
    -webkit-animation-delay: 951ms;
    animation-delay: 951ms;
}
.circle-container:nth-child(101) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-101;
    animation-name: move-frames-101;
    -webkit-animation-duration: 28501ms;
    animation-duration: 28501ms;
    -webkit-animation-delay: 15190ms;
    animation-delay: 15190ms;
}
@-webkit-keyframes move-frames-101 {
    from {
        transform: translate3d(69vw, 101vh, 0);
    }
    to {
        transform: translate3d(28vw, -109vh, 0);
    }
}
@keyframes move-frames-101 {
    from {
        transform: translate3d(69vw, 101vh, 0);
    }
    to {
        transform: translate3d(28vw, -109vh, 0);
    }
}
.circle-container:nth-child(101) .circle {
    -webkit-animation-delay: 341ms;
    animation-delay: 341ms;
}
.circle-container:nth-child(102) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-102;
    animation-name: move-frames-102;
    -webkit-animation-duration: 28975ms;
    animation-duration: 28975ms;
    -webkit-animation-delay: 5496ms;
    animation-delay: 5496ms;
}
@-webkit-keyframes move-frames-102 {
    from {
        transform: translate3d(25vw, 109vh, 0);
    }
    to {
        transform: translate3d(72vw, -121vh, 0);
    }
}
@keyframes move-frames-102 {
    from {
        transform: translate3d(25vw, 109vh, 0);
    }
    to {
        transform: translate3d(72vw, -121vh, 0);
    }
}
.circle-container:nth-child(102) .circle {
    -webkit-animation-delay: 657ms;
    animation-delay: 657ms;
}
.circle-container:nth-child(103) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-103;
    animation-name: move-frames-103;
    -webkit-animation-duration: 35661ms;
    animation-duration: 35661ms;
    -webkit-animation-delay: 33369ms;
    animation-delay: 33369ms;
}
@-webkit-keyframes move-frames-103 {
    from {
        transform: translate3d(8vw, 110vh, 0);
    }
    to {
        transform: translate3d(28vw, -120vh, 0);
    }
}
@keyframes move-frames-103 {
    from {
        transform: translate3d(8vw, 110vh, 0);
    }
    to {
        transform: translate3d(28vw, -120vh, 0);
    }
}
.circle-container:nth-child(103) .circle {
    -webkit-animation-delay: 2304ms;
    animation-delay: 2304ms;
}
.circle-container:nth-child(104) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-104;
    animation-name: move-frames-104;
    -webkit-animation-duration: 33867ms;
    animation-duration: 33867ms;
    -webkit-animation-delay: 7777ms;
    animation-delay: 7777ms;
}
@-webkit-keyframes move-frames-104 {
    from {
        transform: translate3d(77vw, 103vh, 0);
    }
    to {
        transform: translate3d(19vw, -110vh, 0);
    }
}
@keyframes move-frames-104 {
    from {
        transform: translate3d(77vw, 103vh, 0);
    }
    to {
        transform: translate3d(19vw, -110vh, 0);
    }
}
.circle-container:nth-child(104) .circle {
    -webkit-animation-delay: 64ms;
    animation-delay: 64ms;
}
.circle-container:nth-child(105) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-105;
    animation-name: move-frames-105;
    -webkit-animation-duration: 34107ms;
    animation-duration: 34107ms;
    -webkit-animation-delay: 3604ms;
    animation-delay: 3604ms;
}
@-webkit-keyframes move-frames-105 {
    from {
        transform: translate3d(61vw, 102vh, 0);
    }
    to {
        transform: translate3d(3vw, -108vh, 0);
    }
}
@keyframes move-frames-105 {
    from {
        transform: translate3d(61vw, 102vh, 0);
    }
    to {
        transform: translate3d(3vw, -108vh, 0);
    }
}
.circle-container:nth-child(105) .circle {
    -webkit-animation-delay: 2657ms;
    animation-delay: 2657ms;
}
.circle-container:nth-child(106) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-106;
    animation-name: move-frames-106;
    -webkit-animation-duration: 34989ms;
    animation-duration: 34989ms;
    -webkit-animation-delay: 1807ms;
    animation-delay: 1807ms;
}
@-webkit-keyframes move-frames-106 {
    from {
        transform: translate3d(99vw, 104vh, 0);
    }
    to {
        transform: translate3d(16vw, -113vh, 0);
    }
}
@keyframes move-frames-106 {
    from {
        transform: translate3d(99vw, 104vh, 0);
    }
    to {
        transform: translate3d(16vw, -113vh, 0);
    }
}
.circle-container:nth-child(106) .circle {
    -webkit-animation-delay: 3647ms;
    animation-delay: 3647ms;
}
.circle-container:nth-child(107) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-107;
    animation-name: move-frames-107;
    -webkit-animation-duration: 34577ms;
    animation-duration: 34577ms;
    -webkit-animation-delay: 13563ms;
    animation-delay: 13563ms;
}
@-webkit-keyframes move-frames-107 {
    from {
        transform: translate3d(4vw, 104vh, 0);
    }
    to {
        transform: translate3d(1vw, -113vh, 0);
    }
}
@keyframes move-frames-107 {
    from {
        transform: translate3d(4vw, 104vh, 0);
    }
    to {
        transform: translate3d(1vw, -113vh, 0);
    }
}
.circle-container:nth-child(107) .circle {
    -webkit-animation-delay: 2946ms;
    animation-delay: 2946ms;
}
.circle-container:nth-child(108) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-108;
    animation-name: move-frames-108;
    -webkit-animation-duration: 28925ms;
    animation-duration: 28925ms;
    -webkit-animation-delay: 4774ms;
    animation-delay: 4774ms;
}
@-webkit-keyframes move-frames-108 {
    from {
        transform: translate3d(45vw, 103vh, 0);
    }
    to {
        transform: translate3d(92vw, -123vh, 0);
    }
}
@keyframes move-frames-108 {
    from {
        transform: translate3d(45vw, 103vh, 0);
    }
    to {
        transform: translate3d(92vw, -123vh, 0);
    }
}
.circle-container:nth-child(108) .circle {
    -webkit-animation-delay: 2683ms;
    animation-delay: 2683ms;
}
.circle-container:nth-child(109) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-109;
    animation-name: move-frames-109;
    -webkit-animation-duration: 35215ms;
    animation-duration: 35215ms;
    -webkit-animation-delay: 2511ms;
    animation-delay: 2511ms;
}
@-webkit-keyframes move-frames-109 {
    from {
        transform: translate3d(45vw, 101vh, 0);
    }
    to {
        transform: translate3d(23vw, -126vh, 0);
    }
}
@keyframes move-frames-109 {
    from {
        transform: translate3d(45vw, 101vh, 0);
    }
    to {
        transform: translate3d(23vw, -126vh, 0);
    }
}
.circle-container:nth-child(109) .circle {
    -webkit-animation-delay: 1741ms;
    animation-delay: 1741ms;
}
.circle-container:nth-child(110) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-110;
    animation-name: move-frames-110;
    -webkit-animation-duration: 35667ms;
    animation-duration: 35667ms;
    -webkit-animation-delay: 31416ms;
    animation-delay: 31416ms;
}
@-webkit-keyframes move-frames-110 {
    from {
        transform: translate3d(88vw, 110vh, 0);
    }
    to {
        transform: translate3d(84vw, -121vh, 0);
    }
}
@keyframes move-frames-110 {
    from {
        transform: translate3d(88vw, 110vh, 0);
    }
    to {
        transform: translate3d(84vw, -121vh, 0);
    }
}
.circle-container:nth-child(110) .circle {
    -webkit-animation-delay: 2651ms;
    animation-delay: 2651ms;
}
.circle-container:nth-child(111) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-111;
    animation-name: move-frames-111;
    -webkit-animation-duration: 33517ms;
    animation-duration: 33517ms;
    -webkit-animation-delay: 31070ms;
    animation-delay: 31070ms;
}
@-webkit-keyframes move-frames-111 {
    from {
        transform: translate3d(83vw, 107vh, 0);
    }
    to {
        transform: translate3d(50vw, -110vh, 0);
    }
}
@keyframes move-frames-111 {
    from {
        transform: translate3d(83vw, 107vh, 0);
    }
    to {
        transform: translate3d(50vw, -110vh, 0);
    }
}
.circle-container:nth-child(111) .circle {
    -webkit-animation-delay: 429ms;
    animation-delay: 429ms;
}
.circle-container:nth-child(112) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-112;
    animation-name: move-frames-112;
    -webkit-animation-duration: 34917ms;
    animation-duration: 34917ms;
    -webkit-animation-delay: 25610ms;
    animation-delay: 25610ms;
}
@-webkit-keyframes move-frames-112 {
    from {
        transform: translate3d(41vw, 109vh, 0);
    }
    to {
        transform: translate3d(44vw, -111vh, 0);
    }
}
@keyframes move-frames-112 {
    from {
        transform: translate3d(41vw, 109vh, 0);
    }
    to {
        transform: translate3d(44vw, -111vh, 0);
    }
}
.circle-container:nth-child(112) .circle {
    -webkit-animation-delay: 1439ms;
    animation-delay: 1439ms;
}
.circle-container:nth-child(113) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-113;
    animation-name: move-frames-113;
    -webkit-animation-duration: 32874ms;
    animation-duration: 32874ms;
    -webkit-animation-delay: 22037ms;
    animation-delay: 22037ms;
}
@-webkit-keyframes move-frames-113 {
    from {
        transform: translate3d(87vw, 105vh, 0);
    }
    to {
        transform: translate3d(18vw, -106vh, 0);
    }
}
@keyframes move-frames-113 {
    from {
        transform: translate3d(87vw, 105vh, 0);
    }
    to {
        transform: translate3d(18vw, -106vh, 0);
    }
}
.circle-container:nth-child(113) .circle {
    -webkit-animation-delay: 658ms;
    animation-delay: 658ms;
}
.circle-container:nth-child(114) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-114;
    animation-name: move-frames-114;
    -webkit-animation-duration: 32172ms;
    animation-duration: 32172ms;
    -webkit-animation-delay: 7548ms;
    animation-delay: 7548ms;
}
@-webkit-keyframes move-frames-114 {
    from {
        transform: translate3d(26vw, 107vh, 0);
    }
    to {
        transform: translate3d(30vw, -130vh, 0);
    }
}
@keyframes move-frames-114 {
    from {
        transform: translate3d(26vw, 107vh, 0);
    }
    to {
        transform: translate3d(30vw, -130vh, 0);
    }
}
.circle-container:nth-child(114) .circle {
    -webkit-animation-delay: 383ms;
    animation-delay: 383ms;
}
.circle-container:nth-child(115) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-115;
    animation-name: move-frames-115;
    -webkit-animation-duration: 30640ms;
    animation-duration: 30640ms;
    -webkit-animation-delay: 2515ms;
    animation-delay: 2515ms;
}
@-webkit-keyframes move-frames-115 {
    from {
        transform: translate3d(77vw, 107vh, 0);
    }
    to {
        transform: translate3d(89vw, -117vh, 0);
    }
}
@keyframes move-frames-115 {
    from {
        transform: translate3d(77vw, 107vh, 0);
    }
    to {
        transform: translate3d(89vw, -117vh, 0);
    }
}
.circle-container:nth-child(115) .circle {
    -webkit-animation-delay: 1104ms;
    animation-delay: 1104ms;
}
.circle-container:nth-child(116) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-116;
    animation-name: move-frames-116;
    -webkit-animation-duration: 33072ms;
    animation-duration: 33072ms;
    -webkit-animation-delay: 14833ms;
    animation-delay: 14833ms;
}
@-webkit-keyframes move-frames-116 {
    from {
        transform: translate3d(4vw, 109vh, 0);
    }
    to {
        transform: translate3d(60vw, -132vh, 0);
    }
}
@keyframes move-frames-116 {
    from {
        transform: translate3d(4vw, 109vh, 0);
    }
    to {
        transform: translate3d(60vw, -132vh, 0);
    }
}
.circle-container:nth-child(116) .circle {
    -webkit-animation-delay: 3255ms;
    animation-delay: 3255ms;
}
.circle-container:nth-child(117) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-117;
    animation-name: move-frames-117;
    -webkit-animation-duration: 30439ms;
    animation-duration: 30439ms;
    -webkit-animation-delay: 6900ms;
    animation-delay: 6900ms;
}
@-webkit-keyframes move-frames-117 {
    from {
        transform: translate3d(12vw, 108vh, 0);
    }
    to {
        transform: translate3d(11vw, -124vh, 0);
    }
}
@keyframes move-frames-117 {
    from {
        transform: translate3d(12vw, 108vh, 0);
    }
    to {
        transform: translate3d(11vw, -124vh, 0);
    }
}
.circle-container:nth-child(117) .circle {
    -webkit-animation-delay: 2849ms;
    animation-delay: 2849ms;
}
.circle-container:nth-child(118) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-118;
    animation-name: move-frames-118;
    -webkit-animation-duration: 36537ms;
    animation-duration: 36537ms;
    -webkit-animation-delay: 36226ms;
    animation-delay: 36226ms;
}
@-webkit-keyframes move-frames-118 {
    from {
        transform: translate3d(83vw, 106vh, 0);
    }
    to {
        transform: translate3d(37vw, -123vh, 0);
    }
}
@keyframes move-frames-118 {
    from {
        transform: translate3d(83vw, 106vh, 0);
    }
    to {
        transform: translate3d(37vw, -123vh, 0);
    }
}
.circle-container:nth-child(118) .circle {
    -webkit-animation-delay: 1232ms;
    animation-delay: 1232ms;
}
.circle-container:nth-child(119) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-119;
    animation-name: move-frames-119;
    -webkit-animation-duration: 34353ms;
    animation-duration: 34353ms;
    -webkit-animation-delay: 16446ms;
    animation-delay: 16446ms;
}
@-webkit-keyframes move-frames-119 {
    from {
        transform: translate3d(67vw, 102vh, 0);
    }
    to {
        transform: translate3d(74vw, -131vh, 0);
    }
}
@keyframes move-frames-119 {
    from {
        transform: translate3d(67vw, 102vh, 0);
    }
    to {
        transform: translate3d(74vw, -131vh, 0);
    }
}
.circle-container:nth-child(119) .circle {
    -webkit-animation-delay: 3744ms;
    animation-delay: 3744ms;
}
.circle-container:nth-child(120) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-120;
    animation-name: move-frames-120;
    -webkit-animation-duration: 30010ms;
    animation-duration: 30010ms;
    -webkit-animation-delay: 17744ms;
    animation-delay: 17744ms;
}
@-webkit-keyframes move-frames-120 {
    from {
        transform: translate3d(28vw, 104vh, 0);
    }
    to {
        transform: translate3d(55vw, -113vh, 0);
    }
}
@keyframes move-frames-120 {
    from {
        transform: translate3d(28vw, 104vh, 0);
    }
    to {
        transform: translate3d(55vw, -113vh, 0);
    }
}
.circle-container:nth-child(120) .circle {
    -webkit-animation-delay: 1246ms;
    animation-delay: 1246ms;
}
.circle-container:nth-child(121) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-121;
    animation-name: move-frames-121;
    -webkit-animation-duration: 36661ms;
    animation-duration: 36661ms;
    -webkit-animation-delay: 35655ms;
    animation-delay: 35655ms;
}
@-webkit-keyframes move-frames-121 {
    from {
        transform: translate3d(95vw, 110vh, 0);
    }
    to {
        transform: translate3d(73vw, -128vh, 0);
    }
}
@keyframes move-frames-121 {
    from {
        transform: translate3d(95vw, 110vh, 0);
    }
    to {
        transform: translate3d(73vw, -128vh, 0);
    }
}
.circle-container:nth-child(121) .circle {
    -webkit-animation-delay: 654ms;
    animation-delay: 654ms;
}
.circle-container:nth-child(122) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-122;
    animation-name: move-frames-122;
    -webkit-animation-duration: 28416ms;
    animation-duration: 28416ms;
    -webkit-animation-delay: 22720ms;
    animation-delay: 22720ms;
}
@-webkit-keyframes move-frames-122 {
    from {
        transform: translate3d(15vw, 108vh, 0);
    }
    to {
        transform: translate3d(31vw, -124vh, 0);
    }
}
@keyframes move-frames-122 {
    from {
        transform: translate3d(15vw, 108vh, 0);
    }
    to {
        transform: translate3d(31vw, -124vh, 0);
    }
}
.circle-container:nth-child(122) .circle {
    -webkit-animation-delay: 2064ms;
    animation-delay: 2064ms;
}
.circle-container:nth-child(123) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-123;
    animation-name: move-frames-123;
    -webkit-animation-duration: 35110ms;
    animation-duration: 35110ms;
    -webkit-animation-delay: 14056ms;
    animation-delay: 14056ms;
}
@-webkit-keyframes move-frames-123 {
    from {
        transform: translate3d(64vw, 104vh, 0);
    }
    to {
        transform: translate3d(56vw, -118vh, 0);
    }
}
@keyframes move-frames-123 {
    from {
        transform: translate3d(64vw, 104vh, 0);
    }
    to {
        transform: translate3d(56vw, -118vh, 0);
    }
}
.circle-container:nth-child(123) .circle {
    -webkit-animation-delay: 424ms;
    animation-delay: 424ms;
}
.circle-container:nth-child(124) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-124;
    animation-name: move-frames-124;
    -webkit-animation-duration: 31410ms;
    animation-duration: 31410ms;
    -webkit-animation-delay: 11124ms;
    animation-delay: 11124ms;
}
@-webkit-keyframes move-frames-124 {
    from {
        transform: translate3d(74vw, 101vh, 0);
    }
    to {
        transform: translate3d(33vw, -107vh, 0);
    }
}
@keyframes move-frames-124 {
    from {
        transform: translate3d(74vw, 101vh, 0);
    }
    to {
        transform: translate3d(33vw, -107vh, 0);
    }
}
.circle-container:nth-child(124) .circle {
    -webkit-animation-delay: 842ms;
    animation-delay: 842ms;
}
.circle-container:nth-child(125) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-125;
    animation-name: move-frames-125;
    -webkit-animation-duration: 36842ms;
    animation-duration: 36842ms;
    -webkit-animation-delay: 25124ms;
    animation-delay: 25124ms;
}
@-webkit-keyframes move-frames-125 {
    from {
        transform: translate3d(13vw, 109vh, 0);
    }
    to {
        transform: translate3d(32vw, -111vh, 0);
    }
}
@keyframes move-frames-125 {
    from {
        transform: translate3d(13vw, 109vh, 0);
    }
    to {
        transform: translate3d(32vw, -111vh, 0);
    }
}
.circle-container:nth-child(125) .circle {
    -webkit-animation-delay: 3000ms;
    animation-delay: 3000ms;
}
.circle-container:nth-child(126) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-126;
    animation-name: move-frames-126;
    -webkit-animation-duration: 30537ms;
    animation-duration: 30537ms;
    -webkit-animation-delay: 32606ms;
    animation-delay: 32606ms;
}
@-webkit-keyframes move-frames-126 {
    from {
        transform: translate3d(40vw, 106vh, 0);
    }
    to {
        transform: translate3d(91vw, -115vh, 0);
    }
}
@keyframes move-frames-126 {
    from {
        transform: translate3d(40vw, 106vh, 0);
    }
    to {
        transform: translate3d(91vw, -115vh, 0);
    }
}
.circle-container:nth-child(126) .circle {
    -webkit-animation-delay: 1556ms;
    animation-delay: 1556ms;
}
.circle-container:nth-child(127) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-127;
    animation-name: move-frames-127;
    -webkit-animation-duration: 32471ms;
    animation-duration: 32471ms;
    -webkit-animation-delay: 9626ms;
    animation-delay: 9626ms;
}
@-webkit-keyframes move-frames-127 {
    from {
        transform: translate3d(14vw, 105vh, 0);
    }
    to {
        transform: translate3d(51vw, -121vh, 0);
    }
}
@keyframes move-frames-127 {
    from {
        transform: translate3d(14vw, 105vh, 0);
    }
    to {
        transform: translate3d(51vw, -121vh, 0);
    }
}
.circle-container:nth-child(127) .circle {
    -webkit-animation-delay: 2987ms;
    animation-delay: 2987ms;
}
.circle-container:nth-child(128) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-128;
    animation-name: move-frames-128;
    -webkit-animation-duration: 28535ms;
    animation-duration: 28535ms;
    -webkit-animation-delay: 3442ms;
    animation-delay: 3442ms;
}
@-webkit-keyframes move-frames-128 {
    from {
        transform: translate3d(38vw, 110vh, 0);
    }
    to {
        transform: translate3d(33vw, -127vh, 0);
    }
}
@keyframes move-frames-128 {
    from {
        transform: translate3d(38vw, 110vh, 0);
    }
    to {
        transform: translate3d(33vw, -127vh, 0);
    }
}
.circle-container:nth-child(128) .circle {
    -webkit-animation-delay: 194ms;
    animation-delay: 194ms;
}
.circle-container:nth-child(129) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-129;
    animation-name: move-frames-129;
    -webkit-animation-duration: 28853ms;
    animation-duration: 28853ms;
    -webkit-animation-delay: 28127ms;
    animation-delay: 28127ms;
}
@-webkit-keyframes move-frames-129 {
    from {
        transform: translate3d(33vw, 105vh, 0);
    }
    to {
        transform: translate3d(58vw, -112vh, 0);
    }
}
@keyframes move-frames-129 {
    from {
        transform: translate3d(33vw, 105vh, 0);
    }
    to {
        transform: translate3d(58vw, -112vh, 0);
    }
}
.circle-container:nth-child(129) .circle {
    -webkit-animation-delay: 3801ms;
    animation-delay: 3801ms;
}
.circle-container:nth-child(130) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-130;
    animation-name: move-frames-130;
    -webkit-animation-duration: 36046ms;
    animation-duration: 36046ms;
    -webkit-animation-delay: 6645ms;
    animation-delay: 6645ms;
}
@-webkit-keyframes move-frames-130 {
    from {
        transform: translate3d(82vw, 103vh, 0);
    }
    to {
        transform: translate3d(72vw, -133vh, 0);
    }
}
@keyframes move-frames-130 {
    from {
        transform: translate3d(82vw, 103vh, 0);
    }
    to {
        transform: translate3d(72vw, -133vh, 0);
    }
}
.circle-container:nth-child(130) .circle {
    -webkit-animation-delay: 3859ms;
    animation-delay: 3859ms;
}
.circle-container:nth-child(131) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-131;
    animation-name: move-frames-131;
    -webkit-animation-duration: 33106ms;
    animation-duration: 33106ms;
    -webkit-animation-delay: 21903ms;
    animation-delay: 21903ms;
}
@-webkit-keyframes move-frames-131 {
    from {
        transform: translate3d(64vw, 103vh, 0);
    }
    to {
        transform: translate3d(61vw, -133vh, 0);
    }
}
@keyframes move-frames-131 {
    from {
        transform: translate3d(64vw, 103vh, 0);
    }
    to {
        transform: translate3d(61vw, -133vh, 0);
    }
}
.circle-container:nth-child(131) .circle {
    -webkit-animation-delay: 471ms;
    animation-delay: 471ms;
}
.circle-container:nth-child(132) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-132;
    animation-name: move-frames-132;
    -webkit-animation-duration: 31498ms;
    animation-duration: 31498ms;
    -webkit-animation-delay: 16313ms;
    animation-delay: 16313ms;
}
@-webkit-keyframes move-frames-132 {
    from {
        transform: translate3d(39vw, 101vh, 0);
    }
    to {
        transform: translate3d(56vw, -117vh, 0);
    }
}
@keyframes move-frames-132 {
    from {
        transform: translate3d(39vw, 101vh, 0);
    }
    to {
        transform: translate3d(56vw, -117vh, 0);
    }
}
.circle-container:nth-child(132) .circle {
    -webkit-animation-delay: 1156ms;
    animation-delay: 1156ms;
}
.circle-container:nth-child(133) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-133;
    animation-name: move-frames-133;
    -webkit-animation-duration: 31241ms;
    animation-duration: 31241ms;
    -webkit-animation-delay: 1372ms;
    animation-delay: 1372ms;
}
@-webkit-keyframes move-frames-133 {
    from {
        transform: translate3d(67vw, 106vh, 0);
    }
    to {
        transform: translate3d(85vw, -119vh, 0);
    }
}
@keyframes move-frames-133 {
    from {
        transform: translate3d(67vw, 106vh, 0);
    }
    to {
        transform: translate3d(85vw, -119vh, 0);
    }
}
.circle-container:nth-child(133) .circle {
    -webkit-animation-delay: 1824ms;
    animation-delay: 1824ms;
}
.circle-container:nth-child(134) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-134;
    animation-name: move-frames-134;
    -webkit-animation-duration: 35099ms;
    animation-duration: 35099ms;
    -webkit-animation-delay: 13986ms;
    animation-delay: 13986ms;
}
@-webkit-keyframes move-frames-134 {
    from {
        transform: translate3d(76vw, 101vh, 0);
    }
    to {
        transform: translate3d(44vw, -119vh, 0);
    }
}
@keyframes move-frames-134 {
    from {
        transform: translate3d(76vw, 101vh, 0);
    }
    to {
        transform: translate3d(44vw, -119vh, 0);
    }
}
.circle-container:nth-child(134) .circle {
    -webkit-animation-delay: 30ms;
    animation-delay: 30ms;
}
.circle-container:nth-child(135) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-135;
    animation-name: move-frames-135;
    -webkit-animation-duration: 30723ms;
    animation-duration: 30723ms;
    -webkit-animation-delay: 25657ms;
    animation-delay: 25657ms;
}
@-webkit-keyframes move-frames-135 {
    from {
        transform: translate3d(25vw, 110vh, 0);
    }
    to {
        transform: translate3d(65vw, -123vh, 0);
    }
}
@keyframes move-frames-135 {
    from {
        transform: translate3d(25vw, 110vh, 0);
    }
    to {
        transform: translate3d(65vw, -123vh, 0);
    }
}
.circle-container:nth-child(135) .circle {
    -webkit-animation-delay: 240ms;
    animation-delay: 240ms;
}
.circle-container:nth-child(136) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-136;
    animation-name: move-frames-136;
    -webkit-animation-duration: 31672ms;
    animation-duration: 31672ms;
    -webkit-animation-delay: 22187ms;
    animation-delay: 22187ms;
}
@-webkit-keyframes move-frames-136 {
    from {
        transform: translate3d(88vw, 103vh, 0);
    }
    to {
        transform: translate3d(77vw, -106vh, 0);
    }
}
@keyframes move-frames-136 {
    from {
        transform: translate3d(88vw, 103vh, 0);
    }
    to {
        transform: translate3d(77vw, -106vh, 0);
    }
}
.circle-container:nth-child(136) .circle {
    -webkit-animation-delay: 1483ms;
    animation-delay: 1483ms;
}
.circle-container:nth-child(137) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-137;
    animation-name: move-frames-137;
    -webkit-animation-duration: 33156ms;
    animation-duration: 33156ms;
    -webkit-animation-delay: 34709ms;
    animation-delay: 34709ms;
}
@-webkit-keyframes move-frames-137 {
    from {
        transform: translate3d(64vw, 104vh, 0);
    }
    to {
        transform: translate3d(90vw, -124vh, 0);
    }
}
@keyframes move-frames-137 {
    from {
        transform: translate3d(64vw, 104vh, 0);
    }
    to {
        transform: translate3d(90vw, -124vh, 0);
    }
}
.circle-container:nth-child(137) .circle {
    -webkit-animation-delay: 2122ms;
    animation-delay: 2122ms;
}
.circle-container:nth-child(138) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-138;
    animation-name: move-frames-138;
    -webkit-animation-duration: 31604ms;
    animation-duration: 31604ms;
    -webkit-animation-delay: 12581ms;
    animation-delay: 12581ms;
}
@-webkit-keyframes move-frames-138 {
    from {
        transform: translate3d(63vw, 105vh, 0);
    }
    to {
        transform: translate3d(58vw, -129vh, 0);
    }
}
@keyframes move-frames-138 {
    from {
        transform: translate3d(63vw, 105vh, 0);
    }
    to {
        transform: translate3d(58vw, -129vh, 0);
    }
}
.circle-container:nth-child(138) .circle {
    -webkit-animation-delay: 3284ms;
    animation-delay: 3284ms;
}
.circle-container:nth-child(139) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-139;
    animation-name: move-frames-139;
    -webkit-animation-duration: 33267ms;
    animation-duration: 33267ms;
    -webkit-animation-delay: 16859ms;
    animation-delay: 16859ms;
}
@-webkit-keyframes move-frames-139 {
    from {
        transform: translate3d(16vw, 102vh, 0);
    }
    to {
        transform: translate3d(87vw, -126vh, 0);
    }
}
@keyframes move-frames-139 {
    from {
        transform: translate3d(16vw, 102vh, 0);
    }
    to {
        transform: translate3d(87vw, -126vh, 0);
    }
}
.circle-container:nth-child(139) .circle {
    -webkit-animation-delay: 7ms;
    animation-delay: 7ms;
}
.circle-container:nth-child(140) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-140;
    animation-name: move-frames-140;
    -webkit-animation-duration: 31916ms;
    animation-duration: 31916ms;
    -webkit-animation-delay: 21806ms;
    animation-delay: 21806ms;
}
@-webkit-keyframes move-frames-140 {
    from {
        transform: translate3d(68vw, 105vh, 0);
    }
    to {
        transform: translate3d(74vw, -135vh, 0);
    }
}
@keyframes move-frames-140 {
    from {
        transform: translate3d(68vw, 105vh, 0);
    }
    to {
        transform: translate3d(74vw, -135vh, 0);
    }
}
.circle-container:nth-child(140) .circle {
    -webkit-animation-delay: 2549ms;
    animation-delay: 2549ms;
}
.circle-container:nth-child(141) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-141;
    animation-name: move-frames-141;
    -webkit-animation-duration: 29231ms;
    animation-duration: 29231ms;
    -webkit-animation-delay: 18634ms;
    animation-delay: 18634ms;
}
@-webkit-keyframes move-frames-141 {
    from {
        transform: translate3d(31vw, 108vh, 0);
    }
    to {
        transform: translate3d(1vw, -138vh, 0);
    }
}
@keyframes move-frames-141 {
    from {
        transform: translate3d(31vw, 108vh, 0);
    }
    to {
        transform: translate3d(1vw, -138vh, 0);
    }
}
.circle-container:nth-child(141) .circle {
    -webkit-animation-delay: 3999ms;
    animation-delay: 3999ms;
}
.circle-container:nth-child(142) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-142;
    animation-name: move-frames-142;
    -webkit-animation-duration: 32133ms;
    animation-duration: 32133ms;
    -webkit-animation-delay: 33975ms;
    animation-delay: 33975ms;
}
@-webkit-keyframes move-frames-142 {
    from {
        transform: translate3d(48vw, 103vh, 0);
    }
    to {
        transform: translate3d(32vw, -127vh, 0);
    }
}
@keyframes move-frames-142 {
    from {
        transform: translate3d(48vw, 103vh, 0);
    }
    to {
        transform: translate3d(32vw, -127vh, 0);
    }
}
.circle-container:nth-child(142) .circle {
    -webkit-animation-delay: 808ms;
    animation-delay: 808ms;
}
.circle-container:nth-child(143) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-143;
    animation-name: move-frames-143;
    -webkit-animation-duration: 32525ms;
    animation-duration: 32525ms;
    -webkit-animation-delay: 21503ms;
    animation-delay: 21503ms;
}
@-webkit-keyframes move-frames-143 {
    from {
        transform: translate3d(47vw, 106vh, 0);
    }
    to {
        transform: translate3d(48vw, -107vh, 0);
    }
}
@keyframes move-frames-143 {
    from {
        transform: translate3d(47vw, 106vh, 0);
    }
    to {
        transform: translate3d(48vw, -107vh, 0);
    }
}
.circle-container:nth-child(143) .circle {
    -webkit-animation-delay: 3887ms;
    animation-delay: 3887ms;
}
.circle-container:nth-child(144) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-144;
    animation-name: move-frames-144;
    -webkit-animation-duration: 32090ms;
    animation-duration: 32090ms;
    -webkit-animation-delay: 19587ms;
    animation-delay: 19587ms;
}
@-webkit-keyframes move-frames-144 {
    from {
        transform: translate3d(34vw, 107vh, 0);
    }
    to {
        transform: translate3d(85vw, -131vh, 0);
    }
}
@keyframes move-frames-144 {
    from {
        transform: translate3d(34vw, 107vh, 0);
    }
    to {
        transform: translate3d(85vw, -131vh, 0);
    }
}
.circle-container:nth-child(144) .circle {
    -webkit-animation-delay: 1602ms;
    animation-delay: 1602ms;
}
.circle-container:nth-child(145) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-145;
    animation-name: move-frames-145;
    -webkit-animation-duration: 28098ms;
    animation-duration: 28098ms;
    -webkit-animation-delay: 16837ms;
    animation-delay: 16837ms;
}
@-webkit-keyframes move-frames-145 {
    from {
        transform: translate3d(50vw, 109vh, 0);
    }
    to {
        transform: translate3d(52vw, -116vh, 0);
    }
}
@keyframes move-frames-145 {
    from {
        transform: translate3d(50vw, 109vh, 0);
    }
    to {
        transform: translate3d(52vw, -116vh, 0);
    }
}
.circle-container:nth-child(145) .circle {
    -webkit-animation-delay: 1087ms;
    animation-delay: 1087ms;
}
.circle-container:nth-child(146) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-146;
    animation-name: move-frames-146;
    -webkit-animation-duration: 31365ms;
    animation-duration: 31365ms;
    -webkit-animation-delay: 8683ms;
    animation-delay: 8683ms;
}
@-webkit-keyframes move-frames-146 {
    from {
        transform: translate3d(3vw, 109vh, 0);
    }
    to {
        transform: translate3d(32vw, -115vh, 0);
    }
}
@keyframes move-frames-146 {
    from {
        transform: translate3d(3vw, 109vh, 0);
    }
    to {
        transform: translate3d(32vw, -115vh, 0);
    }
}
.circle-container:nth-child(146) .circle {
    -webkit-animation-delay: 2447ms;
    animation-delay: 2447ms;
}
.circle-container:nth-child(147) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-147;
    animation-name: move-frames-147;
    -webkit-animation-duration: 33403ms;
    animation-duration: 33403ms;
    -webkit-animation-delay: 17779ms;
    animation-delay: 17779ms;
}
@-webkit-keyframes move-frames-147 {
    from {
        transform: translate3d(8vw, 102vh, 0);
    }
    to {
        transform: translate3d(11vw, -122vh, 0);
    }
}
@keyframes move-frames-147 {
    from {
        transform: translate3d(8vw, 102vh, 0);
    }
    to {
        transform: translate3d(11vw, -122vh, 0);
    }
}
.circle-container:nth-child(147) .circle {
    -webkit-animation-delay: 3699ms;
    animation-delay: 3699ms;
}
.circle-container:nth-child(148) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-148;
    animation-name: move-frames-148;
    -webkit-animation-duration: 29975ms;
    animation-duration: 29975ms;
    -webkit-animation-delay: 7620ms;
    animation-delay: 7620ms;
}
@-webkit-keyframes move-frames-148 {
    from {
        transform: translate3d(85vw, 108vh, 0);
    }
    to {
        transform: translate3d(3vw, -137vh, 0);
    }
}
@keyframes move-frames-148 {
    from {
        transform: translate3d(85vw, 108vh, 0);
    }
    to {
        transform: translate3d(3vw, -137vh, 0);
    }
}
.circle-container:nth-child(148) .circle {
    -webkit-animation-delay: 2172ms;
    animation-delay: 2172ms;
}
.circle-container:nth-child(149) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-149;
    animation-name: move-frames-149;
    -webkit-animation-duration: 31453ms;
    animation-duration: 31453ms;
    -webkit-animation-delay: 35593ms;
    animation-delay: 35593ms;
}
@-webkit-keyframes move-frames-149 {
    from {
        transform: translate3d(69vw, 104vh, 0);
    }
    to {
        transform: translate3d(11vw, -130vh, 0);
    }
}
@keyframes move-frames-149 {
    from {
        transform: translate3d(69vw, 104vh, 0);
    }
    to {
        transform: translate3d(11vw, -130vh, 0);
    }
}
.circle-container:nth-child(149) .circle {
    -webkit-animation-delay: 3183ms;
    animation-delay: 3183ms;
}
.circle-container:nth-child(150) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-150;
    animation-name: move-frames-150;
    -webkit-animation-duration: 30523ms;
    animation-duration: 30523ms;
    -webkit-animation-delay: 25611ms;
    animation-delay: 25611ms;
}
@-webkit-keyframes move-frames-150 {
    from {
        transform: translate3d(15vw, 105vh, 0);
    }
    to {
        transform: translate3d(86vw, -125vh, 0);
    }
}
@keyframes move-frames-150 {
    from {
        transform: translate3d(15vw, 105vh, 0);
    }
    to {
        transform: translate3d(86vw, -125vh, 0);
    }
}
.circle-container:nth-child(150) .circle {
    -webkit-animation-delay: 3021ms;
    animation-delay: 3021ms;
}
.circle-container:nth-child(151) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-151;
    animation-name: move-frames-151;
    -webkit-animation-duration: 29016ms;
    animation-duration: 29016ms;
    -webkit-animation-delay: 12177ms;
    animation-delay: 12177ms;
}
@-webkit-keyframes move-frames-151 {
    from {
        transform: translate3d(78vw, 109vh, 0);
    }
    to {
        transform: translate3d(46vw, -127vh, 0);
    }
}
@keyframes move-frames-151 {
    from {
        transform: translate3d(78vw, 109vh, 0);
    }
    to {
        transform: translate3d(46vw, -127vh, 0);
    }
}
.circle-container:nth-child(151) .circle {
    -webkit-animation-delay: 2761ms;
    animation-delay: 2761ms;
}
.circle-container:nth-child(152) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-152;
    animation-name: move-frames-152;
    -webkit-animation-duration: 36403ms;
    animation-duration: 36403ms;
    -webkit-animation-delay: 2253ms;
    animation-delay: 2253ms;
}
@-webkit-keyframes move-frames-152 {
    from {
        transform: translate3d(71vw, 108vh, 0);
    }
    to {
        transform: translate3d(44vw, -124vh, 0);
    }
}
@keyframes move-frames-152 {
    from {
        transform: translate3d(71vw, 108vh, 0);
    }
    to {
        transform: translate3d(44vw, -124vh, 0);
    }
}
.circle-container:nth-child(152) .circle {
    -webkit-animation-delay: 2400ms;
    animation-delay: 2400ms;
}
.circle-container:nth-child(153) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-153;
    animation-name: move-frames-153;
    -webkit-animation-duration: 35603ms;
    animation-duration: 35603ms;
    -webkit-animation-delay: 35388ms;
    animation-delay: 35388ms;
}
@-webkit-keyframes move-frames-153 {
    from {
        transform: translate3d(38vw, 106vh, 0);
    }
    to {
        transform: translate3d(61vw, -120vh, 0);
    }
}
@keyframes move-frames-153 {
    from {
        transform: translate3d(38vw, 106vh, 0);
    }
    to {
        transform: translate3d(61vw, -120vh, 0);
    }
}
.circle-container:nth-child(153) .circle {
    -webkit-animation-delay: 1472ms;
    animation-delay: 1472ms;
}
.circle-container:nth-child(154) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-154;
    animation-name: move-frames-154;
    -webkit-animation-duration: 36233ms;
    animation-duration: 36233ms;
    -webkit-animation-delay: 6922ms;
    animation-delay: 6922ms;
}
@-webkit-keyframes move-frames-154 {
    from {
        transform: translate3d(65vw, 107vh, 0);
    }
    to {
        transform: translate3d(25vw, -132vh, 0);
    }
}
@keyframes move-frames-154 {
    from {
        transform: translate3d(65vw, 107vh, 0);
    }
    to {
        transform: translate3d(25vw, -132vh, 0);
    }
}
.circle-container:nth-child(154) .circle {
    -webkit-animation-delay: 265ms;
    animation-delay: 265ms;
}
.circle-container:nth-child(155) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-155;
    animation-name: move-frames-155;
    -webkit-animation-duration: 28093ms;
    animation-duration: 28093ms;
    -webkit-animation-delay: 33386ms;
    animation-delay: 33386ms;
}
@-webkit-keyframes move-frames-155 {
    from {
        transform: translate3d(75vw, 108vh, 0);
    }
    to {
        transform: translate3d(9vw, -124vh, 0);
    }
}
@keyframes move-frames-155 {
    from {
        transform: translate3d(75vw, 108vh, 0);
    }
    to {
        transform: translate3d(9vw, -124vh, 0);
    }
}
.circle-container:nth-child(155) .circle {
    -webkit-animation-delay: 825ms;
    animation-delay: 825ms;
}
.circle-container:nth-child(156) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-156;
    animation-name: move-frames-156;
    -webkit-animation-duration: 31927ms;
    animation-duration: 31927ms;
    -webkit-animation-delay: 13219ms;
    animation-delay: 13219ms;
}
@-webkit-keyframes move-frames-156 {
    from {
        transform: translate3d(100vw, 110vh, 0);
    }
    to {
        transform: translate3d(46vw, -116vh, 0);
    }
}
@keyframes move-frames-156 {
    from {
        transform: translate3d(100vw, 110vh, 0);
    }
    to {
        transform: translate3d(46vw, -116vh, 0);
    }
}
.circle-container:nth-child(156) .circle {
    -webkit-animation-delay: 641ms;
    animation-delay: 641ms;
}
.circle-container:nth-child(157) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-157;
    animation-name: move-frames-157;
    -webkit-animation-duration: 28881ms;
    animation-duration: 28881ms;
    -webkit-animation-delay: 25832ms;
    animation-delay: 25832ms;
}
@-webkit-keyframes move-frames-157 {
    from {
        transform: translate3d(69vw, 103vh, 0);
    }
    to {
        transform: translate3d(13vw, -106vh, 0);
    }
}
@keyframes move-frames-157 {
    from {
        transform: translate3d(69vw, 103vh, 0);
    }
    to {
        transform: translate3d(13vw, -106vh, 0);
    }
}
.circle-container:nth-child(157) .circle {
    -webkit-animation-delay: 1072ms;
    animation-delay: 1072ms;
}
.circle-container:nth-child(158) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-158;
    animation-name: move-frames-158;
    -webkit-animation-duration: 30316ms;
    animation-duration: 30316ms;
    -webkit-animation-delay: 34955ms;
    animation-delay: 34955ms;
}
@-webkit-keyframes move-frames-158 {
    from {
        transform: translate3d(42vw, 108vh, 0);
    }
    to {
        transform: translate3d(77vw, -132vh, 0);
    }
}
@keyframes move-frames-158 {
    from {
        transform: translate3d(42vw, 108vh, 0);
    }
    to {
        transform: translate3d(77vw, -132vh, 0);
    }
}
.circle-container:nth-child(158) .circle {
    -webkit-animation-delay: 3597ms;
    animation-delay: 3597ms;
}
.circle-container:nth-child(159) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-159;
    animation-name: move-frames-159;
    -webkit-animation-duration: 34124ms;
    animation-duration: 34124ms;
    -webkit-animation-delay: 4259ms;
    animation-delay: 4259ms;
}
@-webkit-keyframes move-frames-159 {
    from {
        transform: translate3d(59vw, 106vh, 0);
    }
    to {
        transform: translate3d(35vw, -131vh, 0);
    }
}
@keyframes move-frames-159 {
    from {
        transform: translate3d(59vw, 106vh, 0);
    }
    to {
        transform: translate3d(35vw, -131vh, 0);
    }
}
.circle-container:nth-child(159) .circle {
    -webkit-animation-delay: 1868ms;
    animation-delay: 1868ms;
}
.circle-container:nth-child(160) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-160;
    animation-name: move-frames-160;
    -webkit-animation-duration: 35855ms;
    animation-duration: 35855ms;
    -webkit-animation-delay: 36162ms;
    animation-delay: 36162ms;
}
@-webkit-keyframes move-frames-160 {
    from {
        transform: translate3d(69vw, 103vh, 0);
    }
    to {
        transform: translate3d(86vw, -127vh, 0);
    }
}
@keyframes move-frames-160 {
    from {
        transform: translate3d(69vw, 103vh, 0);
    }
    to {
        transform: translate3d(86vw, -127vh, 0);
    }
}
.circle-container:nth-child(160) .circle {
    -webkit-animation-delay: 1406ms;
    animation-delay: 1406ms;
}
.circle-container:nth-child(161) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-161;
    animation-name: move-frames-161;
    -webkit-animation-duration: 35696ms;
    animation-duration: 35696ms;
    -webkit-animation-delay: 6321ms;
    animation-delay: 6321ms;
}
@-webkit-keyframes move-frames-161 {
    from {
        transform: translate3d(43vw, 105vh, 0);
    }
    to {
        transform: translate3d(9vw, -112vh, 0);
    }
}
@keyframes move-frames-161 {
    from {
        transform: translate3d(43vw, 105vh, 0);
    }
    to {
        transform: translate3d(9vw, -112vh, 0);
    }
}
.circle-container:nth-child(161) .circle {
    -webkit-animation-delay: 803ms;
    animation-delay: 803ms;
}
.circle-container:nth-child(162) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-162;
    animation-name: move-frames-162;
    -webkit-animation-duration: 31463ms;
    animation-duration: 31463ms;
    -webkit-animation-delay: 19460ms;
    animation-delay: 19460ms;
}
@-webkit-keyframes move-frames-162 {
    from {
        transform: translate3d(17vw, 106vh, 0);
    }
    to {
        transform: translate3d(60vw, -126vh, 0);
    }
}
@keyframes move-frames-162 {
    from {
        transform: translate3d(17vw, 106vh, 0);
    }
    to {
        transform: translate3d(60vw, -126vh, 0);
    }
}
.circle-container:nth-child(162) .circle {
    -webkit-animation-delay: 2006ms;
    animation-delay: 2006ms;
}
.circle-container:nth-child(163) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-163;
    animation-name: move-frames-163;
    -webkit-animation-duration: 29937ms;
    animation-duration: 29937ms;
    -webkit-animation-delay: 24205ms;
    animation-delay: 24205ms;
}
@-webkit-keyframes move-frames-163 {
    from {
        transform: translate3d(62vw, 108vh, 0);
    }
    to {
        transform: translate3d(16vw, -119vh, 0);
    }
}
@keyframes move-frames-163 {
    from {
        transform: translate3d(62vw, 108vh, 0);
    }
    to {
        transform: translate3d(16vw, -119vh, 0);
    }
}
.circle-container:nth-child(163) .circle {
    -webkit-animation-delay: 1993ms;
    animation-delay: 1993ms;
}
.circle-container:nth-child(164) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-164;
    animation-name: move-frames-164;
    -webkit-animation-duration: 29723ms;
    animation-duration: 29723ms;
    -webkit-animation-delay: 7355ms;
    animation-delay: 7355ms;
}
@-webkit-keyframes move-frames-164 {
    from {
        transform: translate3d(91vw, 101vh, 0);
    }
    to {
        transform: translate3d(74vw, -125vh, 0);
    }
}
@keyframes move-frames-164 {
    from {
        transform: translate3d(91vw, 101vh, 0);
    }
    to {
        transform: translate3d(74vw, -125vh, 0);
    }
}
.circle-container:nth-child(164) .circle {
    -webkit-animation-delay: 1496ms;
    animation-delay: 1496ms;
}
.circle-container:nth-child(165) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-165;
    animation-name: move-frames-165;
    -webkit-animation-duration: 35565ms;
    animation-duration: 35565ms;
    -webkit-animation-delay: 9337ms;
    animation-delay: 9337ms;
}
@-webkit-keyframes move-frames-165 {
    from {
        transform: translate3d(61vw, 102vh, 0);
    }
    to {
        transform: translate3d(61vw, -121vh, 0);
    }
}
@keyframes move-frames-165 {
    from {
        transform: translate3d(61vw, 102vh, 0);
    }
    to {
        transform: translate3d(61vw, -121vh, 0);
    }
}
.circle-container:nth-child(165) .circle {
    -webkit-animation-delay: 2437ms;
    animation-delay: 2437ms;
}
.circle-container:nth-child(166) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-166;
    animation-name: move-frames-166;
    -webkit-animation-duration: 32065ms;
    animation-duration: 32065ms;
    -webkit-animation-delay: 23873ms;
    animation-delay: 23873ms;
}
@-webkit-keyframes move-frames-166 {
    from {
        transform: translate3d(55vw, 107vh, 0);
    }
    to {
        transform: translate3d(17vw, -126vh, 0);
    }
}
@keyframes move-frames-166 {
    from {
        transform: translate3d(55vw, 107vh, 0);
    }
    to {
        transform: translate3d(17vw, -126vh, 0);
    }
}
.circle-container:nth-child(166) .circle {
    -webkit-animation-delay: 1116ms;
    animation-delay: 1116ms;
}
.circle-container:nth-child(167) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-167;
    animation-name: move-frames-167;
    -webkit-animation-duration: 34143ms;
    animation-duration: 34143ms;
    -webkit-animation-delay: 4603ms;
    animation-delay: 4603ms;
}
@-webkit-keyframes move-frames-167 {
    from {
        transform: translate3d(74vw, 105vh, 0);
    }
    to {
        transform: translate3d(44vw, -107vh, 0);
    }
}
@keyframes move-frames-167 {
    from {
        transform: translate3d(74vw, 105vh, 0);
    }
    to {
        transform: translate3d(44vw, -107vh, 0);
    }
}
.circle-container:nth-child(167) .circle {
    -webkit-animation-delay: 42ms;
    animation-delay: 42ms;
}
.circle-container:nth-child(168) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-168;
    animation-name: move-frames-168;
    -webkit-animation-duration: 30204ms;
    animation-duration: 30204ms;
    -webkit-animation-delay: 148ms;
    animation-delay: 148ms;
}
@-webkit-keyframes move-frames-168 {
    from {
        transform: translate3d(81vw, 107vh, 0);
    }
    to {
        transform: translate3d(74vw, -109vh, 0);
    }
}
@keyframes move-frames-168 {
    from {
        transform: translate3d(81vw, 107vh, 0);
    }
    to {
        transform: translate3d(74vw, -109vh, 0);
    }
}
.circle-container:nth-child(168) .circle {
    -webkit-animation-delay: 2308ms;
    animation-delay: 2308ms;
}
.circle-container:nth-child(169) {
    width: 8px;
    height: 8px;
    -webkit-animation-name: move-frames-169;
    animation-name: move-frames-169;
    -webkit-animation-duration: 31242ms;
    animation-duration: 31242ms;
    -webkit-animation-delay: 11084ms;
    animation-delay: 11084ms;
}
@-webkit-keyframes move-frames-169 {
    from {
        transform: translate3d(62vw, 110vh, 0);
    }
    to {
        transform: translate3d(6vw, -124vh, 0);
    }
}
@keyframes move-frames-169 {
    from {
        transform: translate3d(62vw, 110vh, 0);
    }
    to {
        transform: translate3d(6vw, -124vh, 0);
    }
}
.circle-container:nth-child(169) .circle {
    -webkit-animation-delay: 1704ms;
    animation-delay: 1704ms;
}
.circle-container:nth-child(170) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-170;
    animation-name: move-frames-170;
    -webkit-animation-duration: 29694ms;
    animation-duration: 29694ms;
    -webkit-animation-delay: 25360ms;
    animation-delay: 25360ms;
}
@-webkit-keyframes move-frames-170 {
    from {
        transform: translate3d(28vw, 105vh, 0);
    }
    to {
        transform: translate3d(23vw, -133vh, 0);
    }
}
@keyframes move-frames-170 {
    from {
        transform: translate3d(28vw, 105vh, 0);
    }
    to {
        transform: translate3d(23vw, -133vh, 0);
    }
}
.circle-container:nth-child(170) .circle {
    -webkit-animation-delay: 555ms;
    animation-delay: 555ms;
}
.circle-container:nth-child(171) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-171;
    animation-name: move-frames-171;
    -webkit-animation-duration: 35666ms;
    animation-duration: 35666ms;
    -webkit-animation-delay: 23776ms;
    animation-delay: 23776ms;
}
@-webkit-keyframes move-frames-171 {
    from {
        transform: translate3d(70vw, 110vh, 0);
    }
    to {
        transform: translate3d(93vw, -131vh, 0);
    }
}
@keyframes move-frames-171 {
    from {
        transform: translate3d(70vw, 110vh, 0);
    }
    to {
        transform: translate3d(93vw, -131vh, 0);
    }
}
.circle-container:nth-child(171) .circle {
    -webkit-animation-delay: 2764ms;
    animation-delay: 2764ms;
}
.circle-container:nth-child(172) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-172;
    animation-name: move-frames-172;
    -webkit-animation-duration: 35290ms;
    animation-duration: 35290ms;
    -webkit-animation-delay: 12034ms;
    animation-delay: 12034ms;
}
@-webkit-keyframes move-frames-172 {
    from {
        transform: translate3d(41vw, 101vh, 0);
    }
    to {
        transform: translate3d(79vw, -105vh, 0);
    }
}
@keyframes move-frames-172 {
    from {
        transform: translate3d(41vw, 101vh, 0);
    }
    to {
        transform: translate3d(79vw, -105vh, 0);
    }
}
.circle-container:nth-child(172) .circle {
    -webkit-animation-delay: 1553ms;
    animation-delay: 1553ms;
}
.circle-container:nth-child(173) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-173;
    animation-name: move-frames-173;
    -webkit-animation-duration: 29722ms;
    animation-duration: 29722ms;
    -webkit-animation-delay: 13784ms;
    animation-delay: 13784ms;
}
@-webkit-keyframes move-frames-173 {
    from {
        transform: translate3d(61vw, 109vh, 0);
    }
    to {
        transform: translate3d(37vw, -138vh, 0);
    }
}
@keyframes move-frames-173 {
    from {
        transform: translate3d(61vw, 109vh, 0);
    }
    to {
        transform: translate3d(37vw, -138vh, 0);
    }
}
.circle-container:nth-child(173) .circle {
    -webkit-animation-delay: 3383ms;
    animation-delay: 3383ms;
}
.circle-container:nth-child(174) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-174;
    animation-name: move-frames-174;
    -webkit-animation-duration: 30243ms;
    animation-duration: 30243ms;
    -webkit-animation-delay: 25029ms;
    animation-delay: 25029ms;
}
@-webkit-keyframes move-frames-174 {
    from {
        transform: translate3d(68vw, 102vh, 0);
    }
    to {
        transform: translate3d(42vw, -122vh, 0);
    }
}
@keyframes move-frames-174 {
    from {
        transform: translate3d(68vw, 102vh, 0);
    }
    to {
        transform: translate3d(42vw, -122vh, 0);
    }
}
.circle-container:nth-child(174) .circle {
    -webkit-animation-delay: 1208ms;
    animation-delay: 1208ms;
}
.circle-container:nth-child(175) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-175;
    animation-name: move-frames-175;
    -webkit-animation-duration: 30447ms;
    animation-duration: 30447ms;
    -webkit-animation-delay: 34617ms;
    animation-delay: 34617ms;
}
@-webkit-keyframes move-frames-175 {
    from {
        transform: translate3d(83vw, 104vh, 0);
    }
    to {
        transform: translate3d(88vw, -123vh, 0);
    }
}
@keyframes move-frames-175 {
    from {
        transform: translate3d(83vw, 104vh, 0);
    }
    to {
        transform: translate3d(88vw, -123vh, 0);
    }
}
.circle-container:nth-child(175) .circle {
    -webkit-animation-delay: 2645ms;
    animation-delay: 2645ms;
}
.circle-container:nth-child(176) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-176;
    animation-name: move-frames-176;
    -webkit-animation-duration: 33898ms;
    animation-duration: 33898ms;
    -webkit-animation-delay: 28825ms;
    animation-delay: 28825ms;
}
@-webkit-keyframes move-frames-176 {
    from {
        transform: translate3d(35vw, 105vh, 0);
    }
    to {
        transform: translate3d(87vw, -107vh, 0);
    }
}
@keyframes move-frames-176 {
    from {
        transform: translate3d(35vw, 105vh, 0);
    }
    to {
        transform: translate3d(87vw, -107vh, 0);
    }
}
.circle-container:nth-child(176) .circle {
    -webkit-animation-delay: 3880ms;
    animation-delay: 3880ms;
}
.circle-container:nth-child(177) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-177;
    animation-name: move-frames-177;
    -webkit-animation-duration: 35044ms;
    animation-duration: 35044ms;
    -webkit-animation-delay: 438ms;
    animation-delay: 438ms;
}
@-webkit-keyframes move-frames-177 {
    from {
        transform: translate3d(62vw, 109vh, 0);
    }
    to {
        transform: translate3d(43vw, -117vh, 0);
    }
}
@keyframes move-frames-177 {
    from {
        transform: translate3d(62vw, 109vh, 0);
    }
    to {
        transform: translate3d(43vw, -117vh, 0);
    }
}
.circle-container:nth-child(177) .circle {
    -webkit-animation-delay: 1029ms;
    animation-delay: 1029ms;
}
.circle-container:nth-child(178) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-178;
    animation-name: move-frames-178;
    -webkit-animation-duration: 33806ms;
    animation-duration: 33806ms;
    -webkit-animation-delay: 30115ms;
    animation-delay: 30115ms;
}
@-webkit-keyframes move-frames-178 {
    from {
        transform: translate3d(71vw, 107vh, 0);
    }
    to {
        transform: translate3d(41vw, -123vh, 0);
    }
}
@keyframes move-frames-178 {
    from {
        transform: translate3d(71vw, 107vh, 0);
    }
    to {
        transform: translate3d(41vw, -123vh, 0);
    }
}
.circle-container:nth-child(178) .circle {
    -webkit-animation-delay: 1428ms;
    animation-delay: 1428ms;
}
.circle-container:nth-child(179) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-179;
    animation-name: move-frames-179;
    -webkit-animation-duration: 33836ms;
    animation-duration: 33836ms;
    -webkit-animation-delay: 7032ms;
    animation-delay: 7032ms;
}
@-webkit-keyframes move-frames-179 {
    from {
        transform: translate3d(100vw, 104vh, 0);
    }
    to {
        transform: translate3d(57vw, -121vh, 0);
    }
}
@keyframes move-frames-179 {
    from {
        transform: translate3d(100vw, 104vh, 0);
    }
    to {
        transform: translate3d(57vw, -121vh, 0);
    }
}
.circle-container:nth-child(179) .circle {
    -webkit-animation-delay: 1124ms;
    animation-delay: 1124ms;
}
.circle-container:nth-child(180) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-180;
    animation-name: move-frames-180;
    -webkit-animation-duration: 35816ms;
    animation-duration: 35816ms;
    -webkit-animation-delay: 19605ms;
    animation-delay: 19605ms;
}
@-webkit-keyframes move-frames-180 {
    from {
        transform: translate3d(81vw, 102vh, 0);
    }
    to {
        transform: translate3d(82vw, -105vh, 0);
    }
}
@keyframes move-frames-180 {
    from {
        transform: translate3d(81vw, 102vh, 0);
    }
    to {
        transform: translate3d(82vw, -105vh, 0);
    }
}
.circle-container:nth-child(180) .circle {
    -webkit-animation-delay: 1923ms;
    animation-delay: 1923ms;
}
.circle-container:nth-child(181) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-181;
    animation-name: move-frames-181;
    -webkit-animation-duration: 28222ms;
    animation-duration: 28222ms;
    -webkit-animation-delay: 722ms;
    animation-delay: 722ms;
}
@-webkit-keyframes move-frames-181 {
    from {
        transform: translate3d(9vw, 103vh, 0);
    }
    to {
        transform: translate3d(85vw, -122vh, 0);
    }
}
@keyframes move-frames-181 {
    from {
        transform: translate3d(9vw, 103vh, 0);
    }
    to {
        transform: translate3d(85vw, -122vh, 0);
    }
}
.circle-container:nth-child(181) .circle {
    -webkit-animation-delay: 1624ms;
    animation-delay: 1624ms;
}
.circle-container:nth-child(182) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-182;
    animation-name: move-frames-182;
    -webkit-animation-duration: 36546ms;
    animation-duration: 36546ms;
    -webkit-animation-delay: 29408ms;
    animation-delay: 29408ms;
}
@-webkit-keyframes move-frames-182 {
    from {
        transform: translate3d(7vw, 110vh, 0);
    }
    to {
        transform: translate3d(83vw, -134vh, 0);
    }
}
@keyframes move-frames-182 {
    from {
        transform: translate3d(7vw, 110vh, 0);
    }
    to {
        transform: translate3d(83vw, -134vh, 0);
    }
}
.circle-container:nth-child(182) .circle {
    -webkit-animation-delay: 3151ms;
    animation-delay: 3151ms;
}
.circle-container:nth-child(183) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-183;
    animation-name: move-frames-183;
    -webkit-animation-duration: 34311ms;
    animation-duration: 34311ms;
    -webkit-animation-delay: 23025ms;
    animation-delay: 23025ms;
}
@-webkit-keyframes move-frames-183 {
    from {
        transform: translate3d(20vw, 104vh, 0);
    }
    to {
        transform: translate3d(9vw, -118vh, 0);
    }
}
@keyframes move-frames-183 {
    from {
        transform: translate3d(20vw, 104vh, 0);
    }
    to {
        transform: translate3d(9vw, -118vh, 0);
    }
}
.circle-container:nth-child(183) .circle {
    -webkit-animation-delay: 3928ms;
    animation-delay: 3928ms;
}
.circle-container:nth-child(184) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-184;
    animation-name: move-frames-184;
    -webkit-animation-duration: 34625ms;
    animation-duration: 34625ms;
    -webkit-animation-delay: 31926ms;
    animation-delay: 31926ms;
}
@-webkit-keyframes move-frames-184 {
    from {
        transform: translate3d(90vw, 105vh, 0);
    }
    to {
        transform: translate3d(83vw, -119vh, 0);
    }
}
@keyframes move-frames-184 {
    from {
        transform: translate3d(90vw, 105vh, 0);
    }
    to {
        transform: translate3d(83vw, -119vh, 0);
    }
}
.circle-container:nth-child(184) .circle {
    -webkit-animation-delay: 2300ms;
    animation-delay: 2300ms;
}
.circle-container:nth-child(185) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-185;
    animation-name: move-frames-185;
    -webkit-animation-duration: 30124ms;
    animation-duration: 30124ms;
    -webkit-animation-delay: 7245ms;
    animation-delay: 7245ms;
}
@-webkit-keyframes move-frames-185 {
    from {
        transform: translate3d(52vw, 108vh, 0);
    }
    to {
        transform: translate3d(44vw, -122vh, 0);
    }
}
@keyframes move-frames-185 {
    from {
        transform: translate3d(52vw, 108vh, 0);
    }
    to {
        transform: translate3d(44vw, -122vh, 0);
    }
}
.circle-container:nth-child(185) .circle {
    -webkit-animation-delay: 1364ms;
    animation-delay: 1364ms;
}
.circle-container:nth-child(186) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-186;
    animation-name: move-frames-186;
    -webkit-animation-duration: 34416ms;
    animation-duration: 34416ms;
    -webkit-animation-delay: 7143ms;
    animation-delay: 7143ms;
}
@-webkit-keyframes move-frames-186 {
    from {
        transform: translate3d(86vw, 107vh, 0);
    }
    to {
        transform: translate3d(14vw, -110vh, 0);
    }
}
@keyframes move-frames-186 {
    from {
        transform: translate3d(86vw, 107vh, 0);
    }
    to {
        transform: translate3d(14vw, -110vh, 0);
    }
}
.circle-container:nth-child(186) .circle {
    -webkit-animation-delay: 13ms;
    animation-delay: 13ms;
}
.circle-container:nth-child(187) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-187;
    animation-name: move-frames-187;
    -webkit-animation-duration: 31901ms;
    animation-duration: 31901ms;
    -webkit-animation-delay: 10031ms;
    animation-delay: 10031ms;
}
@-webkit-keyframes move-frames-187 {
    from {
        transform: translate3d(83vw, 108vh, 0);
    }
    to {
        transform: translate3d(87vw, -126vh, 0);
    }
}
@keyframes move-frames-187 {
    from {
        transform: translate3d(83vw, 108vh, 0);
    }
    to {
        transform: translate3d(87vw, -126vh, 0);
    }
}
.circle-container:nth-child(187) .circle {
    -webkit-animation-delay: 2869ms;
    animation-delay: 2869ms;
}
.circle-container:nth-child(188) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-188;
    animation-name: move-frames-188;
    -webkit-animation-duration: 36647ms;
    animation-duration: 36647ms;
    -webkit-animation-delay: 11302ms;
    animation-delay: 11302ms;
}
@-webkit-keyframes move-frames-188 {
    from {
        transform: translate3d(70vw, 103vh, 0);
    }
    to {
        transform: translate3d(21vw, -105vh, 0);
    }
}
@keyframes move-frames-188 {
    from {
        transform: translate3d(70vw, 103vh, 0);
    }
    to {
        transform: translate3d(21vw, -105vh, 0);
    }
}
.circle-container:nth-child(188) .circle {
    -webkit-animation-delay: 1603ms;
    animation-delay: 1603ms;
}
.circle-container:nth-child(189) {
    width: 6px;
    height: 6px;
    -webkit-animation-name: move-frames-189;
    animation-name: move-frames-189;
    -webkit-animation-duration: 34774ms;
    animation-duration: 34774ms;
    -webkit-animation-delay: 31408ms;
    animation-delay: 31408ms;
}
@-webkit-keyframes move-frames-189 {
    from {
        transform: translate3d(75vw, 102vh, 0);
    }
    to {
        transform: translate3d(47vw, -114vh, 0);
    }
}
@keyframes move-frames-189 {
    from {
        transform: translate3d(75vw, 102vh, 0);
    }
    to {
        transform: translate3d(47vw, -114vh, 0);
    }
}
.circle-container:nth-child(189) .circle {
    -webkit-animation-delay: 382ms;
    animation-delay: 382ms;
}
.circle-container:nth-child(190) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-190;
    animation-name: move-frames-190;
    -webkit-animation-duration: 35298ms;
    animation-duration: 35298ms;
    -webkit-animation-delay: 18234ms;
    animation-delay: 18234ms;
}
@-webkit-keyframes move-frames-190 {
    from {
        transform: translate3d(71vw, 102vh, 0);
    }
    to {
        transform: translate3d(92vw, -106vh, 0);
    }
}
@keyframes move-frames-190 {
    from {
        transform: translate3d(71vw, 102vh, 0);
    }
    to {
        transform: translate3d(92vw, -106vh, 0);
    }
}
.circle-container:nth-child(190) .circle {
    -webkit-animation-delay: 1207ms;
    animation-delay: 1207ms;
}
.circle-container:nth-child(191) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-191;
    animation-name: move-frames-191;
    -webkit-animation-duration: 32462ms;
    animation-duration: 32462ms;
    -webkit-animation-delay: 33595ms;
    animation-delay: 33595ms;
}
@-webkit-keyframes move-frames-191 {
    from {
        transform: translate3d(67vw, 102vh, 0);
    }
    to {
        transform: translate3d(46vw, -115vh, 0);
    }
}
@keyframes move-frames-191 {
    from {
        transform: translate3d(67vw, 102vh, 0);
    }
    to {
        transform: translate3d(46vw, -115vh, 0);
    }
}
.circle-container:nth-child(191) .circle {
    -webkit-animation-delay: 442ms;
    animation-delay: 442ms;
}
.circle-container:nth-child(192) {
    width: 4px;
    height: 4px;
    -webkit-animation-name: move-frames-192;
    animation-name: move-frames-192;
    -webkit-animation-duration: 32890ms;
    animation-duration: 32890ms;
    -webkit-animation-delay: 25886ms;
    animation-delay: 25886ms;
}
@-webkit-keyframes move-frames-192 {
    from {
        transform: translate3d(5vw, 107vh, 0);
    }
    to {
        transform: translate3d(71vw, -127vh, 0);
    }
}
@keyframes move-frames-192 {
    from {
        transform: translate3d(5vw, 107vh, 0);
    }
    to {
        transform: translate3d(71vw, -127vh, 0);
    }
}
.circle-container:nth-child(192) .circle {
    -webkit-animation-delay: 3829ms;
    animation-delay: 3829ms;
}
.circle-container:nth-child(193) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-193;
    animation-name: move-frames-193;
    -webkit-animation-duration: 35177ms;
    animation-duration: 35177ms;
    -webkit-animation-delay: 32047ms;
    animation-delay: 32047ms;
}
@-webkit-keyframes move-frames-193 {
    from {
        transform: translate3d(82vw, 103vh, 0);
    }
    to {
        transform: translate3d(90vw, -106vh, 0);
    }
}
@keyframes move-frames-193 {
    from {
        transform: translate3d(82vw, 103vh, 0);
    }
    to {
        transform: translate3d(90vw, -106vh, 0);
    }
}
.circle-container:nth-child(193) .circle {
    -webkit-animation-delay: 13ms;
    animation-delay: 13ms;
}
.circle-container:nth-child(194) {
    width: 3px;
    height: 3px;
    -webkit-animation-name: move-frames-194;
    animation-name: move-frames-194;
    -webkit-animation-duration: 34213ms;
    animation-duration: 34213ms;
    -webkit-animation-delay: 18764ms;
    animation-delay: 18764ms;
}
@-webkit-keyframes move-frames-194 {
    from {
        transform: translate3d(17vw, 102vh, 0);
    }
    to {
        transform: translate3d(51vw, -103vh, 0);
    }
}
@keyframes move-frames-194 {
    from {
        transform: translate3d(17vw, 102vh, 0);
    }
    to {
        transform: translate3d(51vw, -103vh, 0);
    }
}
.circle-container:nth-child(194) .circle {
    -webkit-animation-delay: 1431ms;
    animation-delay: 1431ms;
}
.circle-container:nth-child(195) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-195;
    animation-name: move-frames-195;
    -webkit-animation-duration: 34500ms;
    animation-duration: 34500ms;
    -webkit-animation-delay: 32885ms;
    animation-delay: 32885ms;
}
@-webkit-keyframes move-frames-195 {
    from {
        transform: translate3d(61vw, 109vh, 0);
    }
    to {
        transform: translate3d(49vw, -118vh, 0);
    }
}
@keyframes move-frames-195 {
    from {
        transform: translate3d(61vw, 109vh, 0);
    }
    to {
        transform: translate3d(49vw, -118vh, 0);
    }
}
.circle-container:nth-child(195) .circle {
    -webkit-animation-delay: 3423ms;
    animation-delay: 3423ms;
}
.circle-container:nth-child(196) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-196;
    animation-name: move-frames-196;
    -webkit-animation-duration: 29608ms;
    animation-duration: 29608ms;
    -webkit-animation-delay: 26474ms;
    animation-delay: 26474ms;
}
@-webkit-keyframes move-frames-196 {
    from {
        transform: translate3d(46vw, 110vh, 0);
    }
    to {
        transform: translate3d(36vw, -127vh, 0);
    }
}
@keyframes move-frames-196 {
    from {
        transform: translate3d(46vw, 110vh, 0);
    }
    to {
        transform: translate3d(36vw, -127vh, 0);
    }
}
.circle-container:nth-child(196) .circle {
    -webkit-animation-delay: 2586ms;
    animation-delay: 2586ms;
}
.circle-container:nth-child(197) {
    width: 5px;
    height: 5px;
    -webkit-animation-name: move-frames-197;
    animation-name: move-frames-197;
    -webkit-animation-duration: 30453ms;
    animation-duration: 30453ms;
    -webkit-animation-delay: 17709ms;
    animation-delay: 17709ms;
}
@-webkit-keyframes move-frames-197 {
    from {
        transform: translate3d(84vw, 109vh, 0);
    }
    to {
        transform: translate3d(83vw, -114vh, 0);
    }
}
@keyframes move-frames-197 {
    from {
        transform: translate3d(84vw, 109vh, 0);
    }
    to {
        transform: translate3d(83vw, -114vh, 0);
    }
}
.circle-container:nth-child(197) .circle {
    -webkit-animation-delay: 2869ms;
    animation-delay: 2869ms;
}
.circle-container:nth-child(198) {
    width: 2px;
    height: 2px;
    -webkit-animation-name: move-frames-198;
    animation-name: move-frames-198;
    -webkit-animation-duration: 35693ms;
    animation-duration: 35693ms;
    -webkit-animation-delay: 11775ms;
    animation-delay: 11775ms;
}
@-webkit-keyframes move-frames-198 {
    from {
        transform: translate3d(44vw, 102vh, 0);
    }
    to {
        transform: translate3d(53vw, -107vh, 0);
    }
}
@keyframes move-frames-198 {
    from {
        transform: translate3d(44vw, 102vh, 0);
    }
    to {
        transform: translate3d(53vw, -107vh, 0);
    }
}
.circle-container:nth-child(198) .circle {
    -webkit-animation-delay: 369ms;
    animation-delay: 369ms;
}
.circle-container:nth-child(199) {
    width: 1px;
    height: 1px;
    -webkit-animation-name: move-frames-199;
    animation-name: move-frames-199;
    -webkit-animation-duration: 30034ms;
    animation-duration: 30034ms;
    -webkit-animation-delay: 3438ms;
    animation-delay: 3438ms;
}
@-webkit-keyframes move-frames-199 {
    from {
        transform: translate3d(83vw, 107vh, 0);
    }
    to {
        transform: translate3d(6vw, -135vh, 0);
    }
}
@keyframes move-frames-199 {
    from {
        transform: translate3d(83vw, 107vh, 0);
    }
    to {
        transform: translate3d(6vw, -135vh, 0);
    }
}
.circle-container:nth-child(199) .circle {
    -webkit-animation-delay: 2082ms;
    animation-delay: 2082ms;
}
.circle-container:nth-child(200) {
    width: 7px;
    height: 7px;
    -webkit-animation-name: move-frames-200;
    animation-name: move-frames-200;
    -webkit-animation-duration: 36050ms;
    animation-duration: 36050ms;
    -webkit-animation-delay: 26613ms;
    animation-delay: 26613ms;
}
@-webkit-keyframes move-frames-200 {
    from {
        transform: translate3d(36vw, 107vh, 0);
    }
    to {
        transform: translate3d(7vw, -130vh, 0);
    }
}
@keyframes move-frames-200 {
    from {
        transform: translate3d(36vw, 107vh, 0);
    }
    to {
        transform: translate3d(7vw, -130vh, 0);
    }
}
.circle-container:nth-child(200) .circle {
    -webkit-animation-delay: 1951ms;
    animation-delay: 1951ms;
}
</style>
