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
    }

    type Comment {
        line: Int
        text: String
        user: String
    }

    type Query {
        getAllByUser(userId: ID!): [Document]
        getOne(id: ID!): Document
        getAllDocuments: [Document]  # Ny query för att hämta alla dokument
    }
`);

// Definiera resolvers
const root = {
    getAllByUser: async ({ userId }) => await docs.getAllByUser(userId),
    getOne: async ({ id }) => await docs.getOne(id),
    getAllDocuments: async () => {
        return await docs.getAllDocuments();
    }
};

// Exportera schema och resolvers
export { schema, root };
