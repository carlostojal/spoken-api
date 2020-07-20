const db = require("./db.js");
const utils = require("./utils.js");
const bcrypt = require("bcrypt"); 

exports.resolvers = {
    Query: {

        login: (parent, args, context, info) => {
            let query = db.queries.LOGIN.split("user_login").join(args.login).replace("user_password", args.password);
            return db.query_db(query).then(results => {
                if(results.length == 1) {
                    results = results[0];
                    return results;
                } else {
                    return null;
                }
            });
        },

        // User resolvers
        users: (parent, args, context, info) => {
            let query = db.queries.GET_USERS;
            if(args.username_like)
                query = db.queries.GET_USERS_USERNAME_LIKE.replace("???", args.username_like);
            else if(args.name_like)
                query = db.queries.GET_USERS_NAME_LIKE.replace("???", args.name_like);
            return new Promise((resolve, reject) => {
                db.query_db(query).then(results => { // get users
                    if(results) {
                        results.map((user) => { // get posts for each user
                            db.query_db(db.queries.GET_POSTS_BY_USER.replace("???", user.id)).then(posts => {
                                user.posts = posts;
                                resolve(results);
                            });
                        });
                    } else {
                        resolve(null);
                    }
                });
            });
        },
        user: (parent, args, context, info) => {
            let query;
            if(args.id)
                query = db.queries.GET_USER_BY_ID.replace("???", args.id);
            else if(args.email)
                query = db.queries.GET_USER_BY_EMAIL.replace("???", args.email);
            else if(args.username)
                query = db.queries.GET_USER_BY_USERNAME.replace("???", args.username);
            return new Promise((resolve, reject) => {
                db.query_db(query).then(results => { // get user
                    if(results) {
                        results = results[0];
                        // get user posts
                        db.query_db(db.queries.GET_POSTS_BY_USER.replace("???", results.id)).then(posts => {
                            results.posts = posts;
                            resolve(results);
                        });
                    } else {
                        resolve(null);
                    }
                });
            });
        },

        // Post resolvers
        posts: (parent, args, context, info) => {
            let query = db.queries.GET_POSTS;
            return db.query_db(query).then(results => {
                console.log(results);
                results.map((post) => {
                    utils.extract_user_from_post(post);
                });
                console.log(results);
                return results;
            });
        },
        post: (parent, args, context, info) => {
            let query;
            if(args.id)
                query = db.queries.GET_POST_BY_ID.replace("???", args.id);
            return db.query_db(query).then(results => {
                utils.extract_user_from_post(results);
                return results;
            });
        }
    },
    Mutation: {
        register: async (parent, args, context, info) => {
            let query = db.queries.REGISTER.replace("user_email", args.email).replace("user_name", args.name).replace("user_username", args.username).replace("user_password", await bcrypt.hash(args.password, 12));
            return new Promise((resolve, reject) => {
                db.query_db(query).then(results => {
                    return db.query_db(db.queries.GET_USER_BY_EMAIL.replace("???", args.email)).then(results => {
                        resolve(results[0]);
                    });
                });
            });
        }
    }
}