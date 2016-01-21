function containsUpvote(str) {
    // Will catch +1 and emoji version (:+1:)
    const plusOne = /\+\s*1|👍/;
    return plusOne.test(str);
}

function getUpvoteComments(comments) {
    return comments.filter(comment => containsUpvote(comment.body));
}
