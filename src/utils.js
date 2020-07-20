exports.extract_user_from_post = (post) => {
    post.user = {
        id: post.user,
        email: post.email,
        name: post.name,
        bio: post.bio,
        username: post.username,
        password: post.password
    };
    delete post.email;
    delete post.name;
    delete post.bio;
    delete post.username;
    delete post.password;
    
    return post;
}