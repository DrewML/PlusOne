const flattenArray = arr => [].concat.apply([], arr);
const isDone = metadata => !metadata.pages || !metadata.pages.next;

export function getAllOpenIssues({api, repo, owner}) {
    return api.getRepoIssues({repo, owner}).then(res => {
        const {metadata:meta, body} = res;

        return isDone(meta) ?
            body : followPaging(api, meta.pages.next.uri, [body]);
    }).then(allIssues => {
        return allIssues.map(({title, id}) => {
            return {title, id};
        });
    });
}

function followPaging(api, uri, bucket) {
    return api.request({uri}).then(res => {
        const {metadata:meta} = res;
        bucket.push(res.body);

        return isDone(meta) ?
            flattenArray(bucket) :
            followPaging(api, meta.pages.next.uri, bucket);
    });
}
