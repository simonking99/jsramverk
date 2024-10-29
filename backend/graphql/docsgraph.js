import { buildSchema } from 'graphql';
import docs from '../src/doc/docs.mjs';

// Definiera GraphQL-schema
const schema = buildSchema(`
    type Document {
        _id: ID!
        userId: ID!
        title: String
        content: String
        isCode: Boolean
        comments: [Comment]
        sharedWith: [ID]  # Add sharedWith field if needed
    }

    type Comment {
        line: Int
        text: String
        user: String
    }

    type Query {
        getAllByUser(userId: ID!): [Document]
        getSharedWithUser(userId: ID!): [Document]
        getOne(id: ID!): Document
        getAllDocuments: [Document]
        getAllDocumentsForUser(userId: ID!): [Document]
    }
`);

// Definiera resolvers
const root = {
    getAllByUser: async ({ userId }) => await docs.getAllByUser(userId),
    getSharedWithUser: async ({ userId }) => await docs.getAllShared(userId),  // New resolver
    getOne: async ({ id }) => await docs.getOne(id),
    getAllDocuments: async () => {
        return await docs.getAllDocuments();
    },
    getAllDocumentsForUser: async ({ userId }) => {
        const userDocuments = await docs.getAllByUser(userId);
        const sharedDocuments = await docs.getAllShared(userId);
        return [...userDocuments, ...sharedDocuments];  // Combine both lists
    }
};

// Exportera schema och resolvers
export { schema, root };
