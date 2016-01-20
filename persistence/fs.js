import path from 'path';
import {Promise} from 'bluebird';
import {writeFile} from 'fs';

const writeFileAsync = Promise.promisify(writeFile);

export default function getClient(opts) {
    return Object.create(fsPersistence).init(opts);
};

const COLLECTION_TYPES = {
    ISSUES: 'issues',
    COMMENTS: 'comments'
};

const fsPersistence = {
    init({dir = './data', beautify = true}) {
        this.dir = dir;
        this.indent = beautify ? 4 : 0;
        return Promise.resolve(this);
    },

    addIssues({repo, owner, data}) {
        return writeFileAsync(this.getPathByRepo({
            repo,
            owner,
            type: COLLECTION_TYPES.ISSUES
        }), JSON.stringify(data, null, this.indent), 'utf8');
    },

    addIssueComments({repo, owner, issueID, comments}) {
        return writeFileAsync(this.getPathByRepo({
            repo,
            owner,
            type: COLLECTION_TYPES.COMMENTS,
            ext: issueID
        }), JSON.stringify(comments, null, this.indent ), 'utf8');
    },

    getPathByRepo({repo, owner, type, ext}) {
        return path.join(
            this.dir,
            `${owner}-${repo}-${type}${ext ? `-${ext}` : ''}.json`
        );
    }
};
