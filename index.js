import {getAllOpenIssues} from './issues';
import {getAllIssueComments} from './comments';
import persistence from './persistence/mongo';
import api from './github/api';

const github = api({
    apiToken: process.env.GITHUB_PERSONAL_API_KEY
});

// persistence({ db: 'GitHubPlusOne' }).then(db => {
//     getAllOpenIssues({
//         api: github,
//         repo: 'redux',
//         owner: 'rackt'
//     }).then(data => {
//         return db.addIssues({
//             repo: 'redux',
//             owner: 'rackt',
//             data: data
//         });
//     }).then(process.exit).catch(err => console.error(err.stack));
// });

persistence({ db: 'GitHubPlusOne' }).then(db => {
    getAllIssueComments({
        api: github,
        repo: 'redux',
        owner: 'rackt',
        issueID: 1128
    }).then(comments => {
        return db.addIssueComments({
            repo: 'redux',
            owner: 'rackt',
            issueID: 1128,
            comments
        });
    }).then(process.exit).catch(console.error);
});
