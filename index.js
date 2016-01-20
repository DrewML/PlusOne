import {getAllOpenIssues} from './issues';
import {getAllIssueComments} from './comments';
import persistence from './persistence/fs';
import {green, red} from 'chalk';
import api from './github/api';

const msgs = {
    connecting: green('Connecting to the database...'),
    connected: green('Connected! Fetching data from GitHub'),
    done: green('All Done!'),
    error: red(':(')
};

const log = (...args) => console.log(...args);

const github = api({
    apiToken: process.env.GITHUB_PERSONAL_API_KEY
});

log(msgs.connecting);

persistence({ db: 'GitHubPlusOne' }).then(db => {
    log(msgs.connected);
    const descriptor = {
        repo: 'redux',
        owner: 'rackt'
    };

    return getAllOpenIssues({
        api: github,
        ...descriptor
    }).then(data => {
        return db.addIssues({
            data: data,
            ...descriptor
        });
    });

    // return getAllIssueComments({
    //     api: github,
    //     issueID: 1128,
    //     ...descriptor
    // }).then(comments => {
    //     return db.addIssueComments({
    //         issueID: 1128,
    //         comments,
    //         ...descriptor
    //     });
    // });
}).then(() => log(msgs.done)).catch(err => {
    log(msgs.error, err);
}).finally(process.exit);
