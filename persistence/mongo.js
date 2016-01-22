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

    addIssueComments({repo, owner, issueID, title, comments}) {
        return this.getCollectionByRepo({repo, owner}).insert({
            _id: issueID,
            title,
            comments
        });
    },

    getAllIssues({repo, owner}) {
        return this.getCollectionByRepo({repo, owner}).find({}).toArray();
    },

    getRepoList() {
        // TODO: Lookup why the mongo driver returns each collection
        // item wrapped in an object assigned to the "s" prop
        return this.db.collections().then(colls => colls.s.name);
    },

    getCollectionByRepo({repo, owner, type}) {
        return this.db.collection(`${owner}/${repo}`);
    }
};
