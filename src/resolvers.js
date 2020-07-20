const db = require("./db.js");

exports.resolvers = {
    Query: {

        // User resolvers
        users: (parent, args, context, info) => {
            let query = db.queries.GET_USERS;
            if(args.username_like)
                query = db.queries.GET_USERS_USERNAME_LIKE.replace("???", args.username_like);
            else if(args.name_like)
                query = db.queries.GET_USERS_NAME_LIKE.replace("???", args.name_like);
            return db.query_db(query).then(
                results => results
            );
        },
        user: (parent, args, context, info) => {
            let query;
            if(args.id)
                query = db.queries.GET_USER_BY_ID.replace("???", args.id);
            else if(args.email)
                query = db.queries.GET_USER_BY_EMAIL.replace("???", args.email);
            else if(args.username)
                query = db.queries.GET_USER_BY_USERNAME.replace("???", args.username);
            return db.query_db(query).then(
                results => results
            );
        },

        // Post resolvers
        posts: (parent, args, context, info) => {
            let query = db.queries.GET_POSTS;
            return db.query_db(query).then(results => {
                console.log(results);
                results.map((post) => {
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
                });
                console.log(results);
                return results;
            });
        },
        post: (parent, args, context, info) => {
            let query;
            if(args.id)
                query = db.queries.GET_POST_BY_ID.replace("???", args.id);
            return db.query_db(query).then(
                results => results
            );
        }
    }
}