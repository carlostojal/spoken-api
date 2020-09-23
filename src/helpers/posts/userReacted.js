
/*
*
* Boolean userReacted(user, post)
*
* Summary:
*   The userReacted function receives an
*   user and a post and returns if the user 
*   reacted the post or not.
*
* Parameters:
*   Object: user
*   Object: post
*
* Return Value:
*   Boolean: userReacted
*
* Description:
*   This function receives an user object
*   and a post object and checks if the 
*   provided user ID is in the post
*   reactions array.
*   
*/

const userReacted = (user, post) => {
  if(user && post) {
    for(reaction of post.reactions) {
      if(reaction.user._id.equals(user._id))
        return true;
    }
  }
  return false;
};

module.exports = userReacted;