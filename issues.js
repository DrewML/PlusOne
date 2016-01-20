const isDone = metadata => !metadata.pages || !metadata.pages.next;

export function getAllOpenIssues({api, repo, owner}) {
    return api.getRepoIssues({repo, owner}).then(res => {
        const {metadata:meta, body} = res;

        return isDone(meta) ? body :
            api.followPaging(meta.pages.next.uri, [body]);
    }).then(allIssues => {
        return allIssues.map(({title, number, user}) => {
            return {
                title,
                id: number,
                user: user.login,
                userID: user.id
            };
        });
    });
}
