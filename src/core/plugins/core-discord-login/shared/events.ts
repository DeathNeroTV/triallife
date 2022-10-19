export const DISCORD_LOGIN_EVENTS = {
    PAGE_NAME: 'Login',
    TO_CLIENT: {
        CLOSE: 'discord-login-close',
        OPEN: 'discord-login-open',
        TRY_FINISH: 'discord-login-try-finish',
    },
    TO_SERVER: {
        TRY_FINISH: 'discord-login-try-finish',
        TRY_LEAVE: 'discord-login-try-leave',
    },
    TO_WEBVIEW: {
        SET_ERROR_MESSAGE: 'discord-set-error-message',
    },
};
