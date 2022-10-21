import * as alt from 'alt-client';
import { KeybindController } from '../../../client/events/keyup';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { KEY_BINDS } from '../../../shared/enums/keyBinds';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { PERMISSIONS } from '../../../shared/flags/permissionFlags';
import { Vector3 } from '../../../shared/interfaces/vector';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { Faction } from '../../core-factions/shared/interfaces';
import { ADMIN_INTERACTIONS } from '../shared/events';

const PAGE_NAME = 'Admin';

class AdminView implements ViewModel {
    static init() {
        if (!alt.Player.local.meta.permissionLevel || !isFlagEnabled(alt.Player.local.meta.permissionLevel, PERMISSIONS.MODERATOR | PERMISSIONS.ADMIN | PERMISSIONS.OWNER)) return;
        KeybindController.registerKeybind({ key: KEY_BINDS.ADMIN_MENU, singlePress: AdminView.open });
    }

    static async open() {
        if (isAnyMenuOpen()) return;
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, AdminView.ready);
        view.on(`${PAGE_NAME}:Close`, AdminView.close);
        view.on(`${PAGE_NAME}:Modify`, AdminView.modify);
        view.on(`${PAGE_NAME}:Remove`, AdminView.remove);
        view.on(`${PAGE_NAME}:Position`, AdminView.position);
        view.on(`${PAGE_NAME}:Ban`, AdminView.ban);
        WebViewController.openPages(PAGE_NAME, true, AdminView.close);
        WebViewController.focus();
        WebViewController.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, AdminView.ready);
        view.off(`${PAGE_NAME}:Close`, AdminView.close);
        view.off(`${PAGE_NAME}:Modify`, AdminView.modify);
        view.off(`${PAGE_NAME}:Remove`, AdminView.remove);
        view.off(`${PAGE_NAME}:Position`, AdminView.position);
        WebViewController.closePages([PAGE_NAME], true);
        WebViewController.unfocus();
        WebViewController.showCursor(false);
        alt.Player.local.isMenuOpen = false;
    }

    static ready() {
        alt.emitServer(ADMIN_INTERACTIONS.LOAD);
    }

    static modify(collections: string, _id: string, data: Object) {
        alt.emitServer(ADMIN_INTERACTIONS.MODIFY, collections, _id, data);
    }

    static remove(collections: string, id: string) {
        alt.emitServer(ADMIN_INTERACTIONS.REMOVE, collections, id);
    }

    static async change(key: string, value: any) {
        if (key !== 'admin') return;
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Update`, alt.Player.local.meta.admin);
    }

    static ban(charID: number, state: boolean, reason: string) {
        alt.emitServer(ADMIN_INTERACTIONS.BAN, charID, state, reason);
    }

    static async position(keys: string | string[]) {
        const view = await WebViewController.get();
        var pos = (alt.Player.local.vehicle ? alt.Player.local.vehicle.pos : alt.Player.local.pos) as Vector3;
        pos = { x: pos.x, y: pos.y, z: pos.z - 1 };
        const rot = (alt.Player.local.vehicle ? alt.Player.local.vehicle.rot : alt.Player.local.rot) as Vector3;
        view.emit(`${PAGE_NAME}:Position`, keys, pos, rot);
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, AdminView.init);
alt.on(SYSTEM_EVENTS.META_CHANGED, AdminView.change);
