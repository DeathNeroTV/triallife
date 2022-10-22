import { PluginSystem } from '../../../server/systems/plugins';
import { MailService } from './src/mailer';

const PLUGIN_NAME = 'MAIL-SERVICE';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    MailService.init();

    // Example Usage:
    // MailService.send('someonesemail@email.com', 'Testing', 'Well hello there.');
});
