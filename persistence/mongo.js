import {MongoClient} from 'mongodb';
import Promise from 'bluebird';

export default function getClient(opts) {
    return Object.create(mongoPersistence).init(opts);
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
        const fixID = issue => ({ _id: issue.id, ...issue });
        const fixed = Array.isArray(data) ? data.map(fixID) : fixID(data);

        return this.db.collection(`${owner}/${repo}`).insert(fixed);
    },

    getRepoList() {
        // TODO: Lookup why the mongo driver returns each collection
        // item wrapped in an object assigned to the "s" prop
        return this.db.collections().then(colls => colls.s.name);
    }
};
