function containsUpvote(str) {
    // Will catch +1 and emoji version (:+1:)
    const plusOne = /\+1|👍/;
    return plusOne.test(str);
}

function getUpvoteComments(comments) {
    return comments.filter(comment => containsUpvote(comment.body));
}

export function getCountsByIssue(issues, {idProp, commentsProp, titleProp}) {
    return issues.map(issue => {
        return {
            id: issue[idProp],
            title: issue[titleProp],
            count: getUpvoteComments(issue[commentsProp]).length
        };
    }).filter(issue => issue.count).sort((a, b) => {
        return b.count - a.count;
    }); 
}
