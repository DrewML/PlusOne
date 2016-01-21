import api from './github/api';
import persistence from './persistence';
import {getAllOpenIssues, getAllIssueComments} from './collection';

export default function fetchAll({apiToken, repo, owner, storage, dbName}) {
    const github = api({
        apiToken
    });
    const descriptor = {repo, owner};

    return persistence[storage]({ db: dbName }).then(db => {
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
    });
}
