import persistence from './persistence';
import {getCountsByIssue} from './processing';

export default function processAll({repo, owner, storage, dbName}) {
    // TODO: Use bluebird's "using" to dispose of DB connection
    return persistence[storage]({ db: dbName }).then(db => {
        return db.getAllIssues({repo, owner}).then(comments => {
            return getCountsByIssue(comments, {
                idProp: '_id',
                commentsProp: 'comments'
            });
        });
    });
}
