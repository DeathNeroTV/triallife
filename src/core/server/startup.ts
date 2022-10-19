import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { DiscordController } from '../plugins/core-discord/server/src/discordController';
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
            alt.logWarning(`Failed to load Configuration File. Is 'triallifeConfig.json' file malformed? Try setting to default values again.`);
            process.exit(1);
        }

        const url = MongoUtil.getURL(config);
        const collections = MongoUtil.getCollections();

        Database.init(url, MongoUtil.getName(), collections)
            .catch(() => {
                MongoUtil.throwConnectionError();
            })
            .then((res) => {
                if (res) {
                    alt.log(`MongoDB connection was established.`);
                    return;
                }

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
            alt.logWarning(`Failed to load Configuration File. Is 'triallifeConfig.json' file malformed? Try setting to default values again.`);
            process.exit(1);
        }
        // @ts-ignore
        await import(`./boot.js`);
        alt.log(`~lb~3L:RP ==>~lg~ Total Bootup Time -- ~y~${Date.now() - startTime}ms`);
    }

    static async toggleEntry() {
        alt.off('playerConnect', Startup.handleEarlyConnect);
        alt.log(`~b~Server Warmup Complete. Now accepting connections.`);
        ReconnectHelper.invoke();
    }

    static handleEarlyConnect(player: alt.Player) {
        if (!(player instanceof alt.Player) || !player || !player.valid) {
            return;
        }
        try {
            player.kick('[triallife] Connected too early. Server still warming up.');
        } catch (err) {
            alt.log(`[triallife] A reconnection event happened too early. Try again.`);
        }
    }
}

alt.on('playerConnect', Startup.handleEarlyConnect);
alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, Startup.toggleEntry);

Startup.begin();
