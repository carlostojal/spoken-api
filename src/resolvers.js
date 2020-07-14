
let users = [
    {
        id: 1,
        email: "carlos.tojal@hotmail.com",
        name: "Carlos Tojal",
        username: "carlostojal",
        password: "password123"
    }
]

const resolvers = {
    Query: {
        users: () => users
    }
}

export default resolvers;