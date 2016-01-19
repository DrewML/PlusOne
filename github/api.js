import rp from 'request-promise';

const api = {
    init({apiToken, baseURI}) {
        if (!apiToken) {
            throw new Error('API Token Required');
        }

        this.token = apiToken;
        this.baseURI = baseURI || 'https://api.github.com';
        return this;
    },

    request(opts = {}) {
        const defaults = {
            method: 'GET',
            headers: {
                'User-Agent': 'PlusOne-Analyzer',
                'Authorization': `token ${this.token}`
            },
            json: true,
            resolveWithFullResponse: true
        };

        return rp({...defaults, ...opts}).then(res => {
            const {body, link, headers} = res;

            res.metadata = {
                pages: this.parsePagination(res),
                rateLimit: this.getRateLimit(res)
            };

            // TODO: move this warning out of the general req fn
            const {remaining} = res.metadata.rateLimit;
            console.warn(`${remaining} requests remaining`);

            return res;
        });
    },

    _uri(relPath) {
        return `${this.baseURI}${relPath}`;
    },

    parsePagination({headers}) {
        if ((!headers || !headers.link)) return;

        const pages = headers.link.split(',');
        const pattern = /<(.+?)>;\srel="(\w+?)"/;

        return pages.reduce((accumulator, page) => {
            const [, uri, rel] = page.match(pattern);
            accumulator[rel] = {
                uri,
                num: uri.match(/page=(\d+)/)[1]
            };
            return accumulator;
        }, {});
    },

    getIssueComments({issueID, repo, owner}) {
        return this.request({
            uri: this._uri(`/repos/${owner}/${repo}/issues/${issueID}/comments`)
        });
    },

    getRepoIssues({repo, owner}) {
        return this.request({
            uri: this._uri(`/repos/${owner}/${repo}/issues`),
            qs: {
                filter: 'all',
                per_page: 15
            }
        });
    },

    updateComment({commentID, body, owner, repo}) {
        return this.request({
            method: 'PATCH',
            uri: this._uri(`/repos/${owner}/${repo}/issues/comments/${commentID}`),
            data: { body }
        });
    },

    getRateLimit({headers}) {
        return headers && {
            limit: headers['x-ratelimit-limit'],
            remaining: headers['x-ratelimit-remaining'],
            resetTime: new Date(headers['x-ratelimit-reset'] * 1000)
        };
    }
};

export default function createAPIClient(opts) {
    return Object.create(api).init(opts);
}
