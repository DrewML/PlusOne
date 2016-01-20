import {MongoClient} from 'mongodb';
import Promise from 'bluebird';

export default function getClient(opts) {
    return Object.create(mongoPersistence).init(opts);
};

const COLLECTION_TYPES = {
    ISSUES: 'issues',
    COMMENTS: 'comments'
};

const mongoPersistence = {
    init({host = 'localhost', port = 27017, db = 'GitHubPlusOne'}) {
        const uri = `mongodb://${host}:${port}/${db}`;

        return MongoClient.connect(uri, {
            promiseLibrary: Promise
        }).then(db => {
            this.db = db;
            return this;
        });
    },

    addIssues({repo, owner, data}) {
        return this.getCollectionByRepo({
            repo,
            owner,
            type: COLLECTION_TYPES.ISSUES
        }).insert(data);
    },

    addIssueComments({repo, owner, issueID, comments}) {
        return this.getCollectionByRepo({
            repo,
            owner,
            type: COLLECTION_TYPES.COMMENTS
        }).insert({
            id: issueID,
            comments
        });
    },

    getRepoList() {
        // TODO: Lookup why the mongo driver returns each collection
        // item wrapped in an object assigned to the "s" prop
        return this.db.collections().then(colls => colls.s.name);
    },

    getCollectionByRepo({repo, owner, type}) {
        return this.db.collection(`${owner}/${repo}:${type}`);
    }
};
