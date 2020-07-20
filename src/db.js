const mysql = require("mysql");

exports.queries = {
    // User queries
    GET_USERS: "SELECT * FROM user",
    GET_USER_BY_ID: "SELECT * FROM user WHERE id = '???'",
    GET_USER_BY_EMAIL: "SELECT * FROM user WHERE email = '???'",
    GET_USER_BY_USERNAME: "SELECT * FROM user WHERE username = '???'",
    GET_USERS_USERNAME_LIKE: "SELECT * FROM user WHERE username LIKE '%???%'",
    GET_USERS_NAME_LIKE: "SELECT * FROM user WHERE name LIKE '%???%'",
    // Post queries
    GET_POSTS: "SELECT post.*, user.email, user.name, user.bio, user.username, user.password FROM post INNER JOIN user ON post.user = user.id",
    GET_POST_BY_ID: "SELECT * FROM post WHERE id = '???'",
}

exports.createConnection = () => {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    return con;
}

exports.query_db = (query) => {
    var con = this.createConnection();
    return new Promise((resolve, reject) => {
        con.connect((err) => {
            if (err) throw err;
            con.query(query, (err, result) => {
                if (err) throw err;
                result = JSON.parse(JSON.stringify(result));
                if(result.length == 1)
                    result = result[0];
                resolve(result);
            });
        });
    });
}