import path from 'path';
import {Promise} from 'bluebird';
import {writeFile} from 'fs';

const writeFileAsync = Promise.promisify(writeFile);

export default function getClient(opts) {
    return Object.create(fsPersistence).init(opts);
};

const fsPersistence = {
    init({dir = './data', beautify = true}) {
        this.dir = dir;
        this.indent = beautify ? 4 : 0;
        return Promise.resolve(this);
    },

    addIssueComments({repo, owner, issueID, comments}) {
        return writeFileAsync(this.getPathByRepo({
            repo,
            owner,
            ext: issueID
        }), JSON.stringify(comments, null, this.indent ), 'utf8');
    },

    getPathByRepo({repo, owner, type, ext}) {
        return path.join(
            this.dir,
            `${owner}-${repo}${ext ? `-${ext}` : ''}.json`
        );
    }
};
