const resolvers = require("./taskResolvers");
const { gql, ApolloServer } = require("apollo-server-express");

const schema = gql`
    type Query {
        tasks: [Task]
        taskById(id: String!): Task
        downloadFile(fileName: String!): Boolean
    }

    type Mutation {
        createTask(task: TaskInput!): Task
        updateTask(task: TaskInput!): Task
        deleteTask(id: String!): Boolean
        setTaskStatus(id: String!, completed: Boolean!): Boolean
        deleteAttachedFile(id: String!): Boolean
    }

    input TaskInput {
        _id: String!
        user: String!
        title: String!
        completed: Boolean!
        dueDate: Date!
        fileName: String
        realFileName: String
    }

    type Task {
        _id: String!
        user: String!
        title: String!
        completed: Boolean!
        dueDate: Date!
        fileName: String
        realFileName: String
    }

    scalar Date
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