const db = require("./db.js");

exports.resolvers = {
    Query: {
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
        }
    }
}