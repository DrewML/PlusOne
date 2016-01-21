function containsUpvote(str) {
    // Will catch +1 and emoji version (:+1:)
    const plusOne = /\+1|👍/;
    return plusOne.test(str);
}

function getUpvoteComments(comments) {
    return comments.filter(comment => containsUpvote(comment.body));
}

export function getCountsByIssue(issues, {idProp, commentsProp}) {
    return issues.map(issue => {
        return {
            id: issue[idProp],
            count: getUpvoteComments(issue[commentsProp]).length
        };
    });
}
