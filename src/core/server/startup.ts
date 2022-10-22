import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../shared/enums/system';
import { IConfig } from './interface/iConfig';
import ConfigUtil from './utility/config';
import MongoUtil from './utility/mongo';
import { ReconnectHelper } from './utility/reconnect';

const startTime = Date.now();
let config: IConfig | undefined;

class Startup {
    static async begin() {
        // Validate the Configuration
        config = ConfigUtil.get();

        // Start Database
        Startup.database();

        // Start Ares Connection Protocol
        await Startup.ares();
    }

    /**
     * Used to start the Database.
     * @static
     * @memberof Startup
     */
    static database() {
        if (typeof config === 'undefined') {
            alt.logWarning(`Konfigurationsdatei konnte nicht geladen werden. Ist die Datei „triallifeConfig.json“ fehlerhaft? Versuchen Sie erneut, die Standardwerte einzustellen.`);
            process.exit(1);
        }

        const url = MongoUtil.getURL(config);
        const collections = MongoUtil.getCollections();

        Database.init(url, MongoUtil.getName(), collections)
            .catch(() => {
                MongoUtil.throwConnectionError();
            })
            .then((res) => {
                if (res) return;
                MongoUtil.throwConnectionError();
            });
    }

    /**
     * Sets the current ares endpoint.
     * @static
     * @memberof Startup
     */
    static async ares() {
        if (typeof config === 'undefined') {
            alt.logWarning(`Konfigurationsdatei konnte nicht geladen werden. Ist die Datei „triallifeConfig.json“ fehlerhaft? Versuchen Sie erneut, die Standardwerte einzustellen.`);
            process.exit(1);
        }
        // @ts-ignore
        await import(`./boot.js`);
    }

    static async toggleEntry() {
        alt.off('playerConnect', Startup.handleEarlyConnect);
        ReconnectHelper.invoke();
        alt.log(`~lb~3L:RP ~w~==> ~lg~Server ~lk~wurde in ~y~${((Date.now() - startTime) / 1000).toFixed(2)}s ~lk~gestartet`);
    }

    static handleEarlyConnect(player: alt.Player) {
        if (!(player instanceof alt.Player) || !player || !player.valid) return;
        try {
            player.kick('[Trial Life] Zu früh verbunden. Server wird noch aufgewärmt.');
        } catch (err) {
            alt.log(`~lb~3LRP ==> ~w~Ein Wiederverbindungsereignis ist zu früh aufgetreten. Versuchen Sie es nochmal.`);
        }
    }
}

alt.on('playerConnect', Startup.handleEarlyConnect);
alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, Startup.toggleEntry);

Startup.begin();
