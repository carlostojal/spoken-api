const mysql = require("mysql");

exports.queries = {
    // Register query
    REGISTER: "INSERT into user (email, name, username, password) VALUES ('user_email', 'user_name', 'user_username', 'user_password')",
    // Login query
    LOGIN: "SELECT id, email, username FROM user WHERE (email = 'user_login' OR username = 'user_login') AND password = 'user_password'",
    // User queries
    GET_USERS: "SELECT * FROM user",
    GET_USER_BY_ID: "SELECT * FROM user WHERE user.id = '???'",
    GET_USER_BY_EMAIL: "SELECT * FROM user WHERE user.email = '???'",
    GET_USER_BY_USERNAME: "SELECT * FROM user WHERE user.username = '???'",
    GET_USERS_USERNAME_LIKE: "SELECT * FROM user WHERE user.username LIKE '%???%'",
    GET_USERS_NAME_LIKE: "SELECT * FROM user WHERE name LIKE '%???%'",
    // Post queries
    GET_POSTS: "SELECT post.*, user.email, user.name, user.bio, user.username, user.password FROM post INNER JOIN user ON post.user = user.id",
    GET_POSTS_BY_USER: "SELECT post.*, user.email, user.name, user.bio, user.username, user.password FROM post INNER JOIN user ON post.user = user.id WHERE post.user = '???'",
    GET_POST_BY_ID: "SELECT post.*, user.email, user.name, user.bio, user.username, user.password FROM post INNER JOIN user ON post.user = user.id WHERE post.id = '???'",
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
                resolve(result);
            });
        });
    });
}