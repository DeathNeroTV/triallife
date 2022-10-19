import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.onServer(SYSTEM_EVENTS.META_SET, (key, value) => {
    if (!alt.Player.local.meta) alt.Player.local.meta = {};
    alt.emit(SYSTEM_EVENTS.META_CHANGED, key, value, alt.Player.local.meta[key]);
    alt.Player.local.meta[key] = value;
});
