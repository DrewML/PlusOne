const flattenArray = arr => [].concat.apply([], arr);

export function getAllOpenIssues({api, repo, owner}) {
    return api.getRepoIssues({repo, owner}).then(res => {
        const meta = res.metadata;
        const isDone = !meta.pages || !meta.pages.next;
        const bucket = [res.body];

        return isDone ? bucket : followPaging(api, meta.pages.next.uri, bucket);
    }).then(allIssues => {
        return flattenArray(allIssues).map(({title, id}) => {
            return {title, id};
        });
    });
}

function followPaging(api, uri, bucket) {
    return api.request({uri}).then(res => {
        const {metadata:meta} = res;
        const isDone = !meta.pages.next;

        bucket.push(res.body);

        return isDone ? bucket : followPaging(api, meta.pages.next.uri, bucket);
    });
}
