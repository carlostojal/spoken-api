import apollo from "apollo-server";
const { gql } = apollo;

const typedefs = gql`
  
  type User {
    id: Int!,
    email: String!,
    name: String!,
    bio: String,
    username: String!,
    password: String!
  }

  type Query {
    users: [User]
  }

`;

export default typedefs;