const isDone = metadata => !metadata.pages || !metadata.pages.next;

export function getAllIssueComments({api, repo, owner, issueID}) {
    return api.getIssueComments({repo, owner, issueID}).then(res => {
        const {metadata:meta, body} = res;

        return isDone(meta) ? body :
            api.followPaging(meta.pages.next.uri, [body]);
    });
}
