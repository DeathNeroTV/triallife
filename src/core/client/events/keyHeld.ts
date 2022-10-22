import alt from 'alt-client';

const holdableKeys: { [key: string]: Array<{ onKeyDown?: Function; onKeyUp?: Function }> } = {};

class InternalFunctions {
    static handleKeyUp(key: number) {
        if (!holdableKeys[key]) return;
        for (const [, handlers] of Object.entries(holdableKeys[key])) {
            handlers.onKeyUp?.();
        }
    }

    static handleKeyDown(key: number) {
        if (!holdableKeys[key]) return;
        for (const [, handlers] of Object.entries(holdableKeys[key])) {
            handlers.onKeyDown?.();
        }
    }
}

export class KeyHeld {
    static init() {
        alt.on('keyup', InternalFunctions.handleKeyUp);
        alt.on('keydown', InternalFunctions.handleKeyDown);
    }

    /**
     * Use https://keycode.info for proper key numbers.
     **/
    static register(key: number, onKeyDown: Function | undefined, onKeyUp: Function | undefined = undefined): void {
        if (typeof key === 'undefined') {
            alt.logError(`Key was not specified for KeyHeld.register`);
            return;
        }
        if (typeof onKeyDown !== 'function' && typeof onKeyUp !== 'function') {
            alt.logWarning(`${key} in KeyHeld.register does not have valid callback functions.`);
            return;
        }
        if (!holdableKeys[key]) holdableKeys[key] = [];
        holdableKeys[key].push({
            onKeyUp,
            onKeyDown,
        });
        alt.log(`~lb~3L:RP ~w~==>  ~lg~${String.fromCharCode(key)} wurde als Tastenkürzel (~lb~haltend~lg~) hinzugefügt.`);
    }

    /**
     * Use https://keycode.info for proper key numbers.
     **/
    static unregister(key: number, onKeyDown: Function | undefined, onKeyUp: Function | undefined = undefined): void {
        if (typeof key === 'undefined') {
            alt.logError(`Key was not specified for KeyHeld.unregister`);
            return;
        }
        if (typeof onKeyDown !== 'function' && typeof onKeyUp !== 'function') {
            alt.logWarning(`${key} in KeyHeld.unregister does not have valid callback functions.`);
            return;
        }
        if (!holdableKeys[key]) return;
        for (const [index, handlers] of Object.entries(holdableKeys[key])) {
            const onKeyDownValid = typeof onKeyDown === 'function' && handlers.onKeyDown === onKeyDown;
            const onKeyUpValid = typeof onKeyUp === 'function' && handlers.onKeyUp === onKeyUp;

            if (onKeyDownValid) delete handlers.onKeyDown;
            if (typeof onKeyUp === 'function' && handlers.onKeyUp === onKeyUp) delete handlers.onKeyUp;
            if (typeof handlers.onKeyDown === 'undefined' && typeof handlers.onKeyUp === 'undefined') {
                holdableKeys[key].splice(<number>(<unknown>index), 1);
            }
        }
        holdableKeys[key] = holdableKeys[key].filter((handlers) => {
            const keyDownExists = typeof handlers.onKeyDown === 'function' && handlers.onKeyDown === onKeyDown;
            const keyUpExists = typeof handlers.onKeyUp === 'function' && handlers.onKeyUp === onKeyUp;
            if (keyDownExists || keyUpExists) return false;
            return true;
        });
    }
}

KeyHeld.init();
