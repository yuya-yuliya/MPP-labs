const resolvers = require("./userResolvers");
const { gql, ApolloServer } = require("apollo-server-express");

const schema = gql`
    type Query {
        signout: Boolean
    }

    type Mutation {
        signin(login: String!, password: String!): String
        signup(user: UserInput!): User
    }
    
    input UserInput {
        login: String!
        password: String!
    }

    type User {
        login: String!
    }
`;

module.exports = new ApolloServer({ 
    typeDefs: schema,
    resolvers: resolvers,
    playground: {
        settings: {
            "editor.theme": "light"
        }
    },
    formatError: error => {
        let errorInfo = error.message.split("|");
        return { 
            code: errorInfo[0],
            message: errorInfo[1]       
        };
    }
});
