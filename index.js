import api from './github/api';
import {green, red} from 'chalk';
import persistence from './persistence';
import {getAllOpenIssues, getAllIssueComments} from './collection';

const msgs = {
    connecting: green('Connecting to the database...'),
    connected: green('Connected! Fetching data from GitHub'),
    done: green('All issue comments have been fetched successfully!'),
    error: red(':(')
};

const log = (...args) => console.log(...args);

const github = api({
    apiToken: process.env.GITHUB_PERSONAL_API_KEY
});

log(msgs.connecting);

persistence.fs({ db: 'GitHubPlusOne' }).then(db => {
    log(msgs.connected);
    const descriptor = {
        repo: 'redux',
        owner: 'rackt'
    };

    return getAllOpenIssues({
        api: github,
        ...descriptor
    }).then(issues => {
        return Promise.all(issues.map(issue => {
            return getAllIssueComments({
                api: github,
                issueID: issue.id,
                ...descriptor
            }).then(comments => {
                return db.addIssueComments({
                    issueID: issue.id,
                    comments,
                    ...descriptor
                });
            });
        }));
    });
}).catch(err => {
    log(msgs.error, err);
}).finally(process.exit);
