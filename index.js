import fetchAll from './fetch';
import parseArgs from 'minimist';
import {green, red} from 'chalk';

const log = (...args) => console.log(...args);
const msgs = {
    connecting: green('Connecting...'),
    done: green('All issue comments have been fetched successfully!'),
    error: red(':(')
};

const settings = getSettings();

log(msgs.connecting);

fetchAll({
    apiToken: process.env.GITHUB_PERSONAL_API_KEY,
    repo: settings.repo,
    owner: settings.owner,
    storage: settings.storage,
    dbName: 'GitHubPlusOne'
}).then(() => {
    log(msgs.done);
    process.exit();
}).catch(err => {
    log(msgs.error, err.stack);
});

function getSettings() {
    const settings = parseArgs(process.argv);
    const required = ['repo', 'owner'];
    const optional = {
        storage: 'fs'
    };

    required.forEach(opt => {
        if (!settings[opt]) {
             log(red(`Missing required arg: --${opt}`));
             process.exit();
        }
    });

    Object.keys(optional).forEach(opt => {
        if (!settings.hasOwnProperty(opt)) {
            settings[opt] = optional[opt];
        }
    });

    return settings;
}
