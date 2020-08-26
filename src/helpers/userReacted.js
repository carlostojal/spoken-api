
const userReacted = (user, post) => {
  if(user && post) {
    for(let i = 0; i < post.reactions.length; i++) {
      if(post.reactions[i].user.id == user.id)
        return true;
    }
  }
  return false;
};

module.exports = userReacted;