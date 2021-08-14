import { ApolloServer } from 'apollo-server';
import { getUser } from 'meteor/apollo';
import { resolvers } from '/server/resolvers';

const url = require("url");

const server = new ApolloServer({
  typeDefs: `
scalar JSON 

type Query {
    getProject(_id: ID!): JSON
    getProjects: [JSON]
}

type Mutation {
    addProject(input: String!): Boolean!
}  
  `,
  resolvers,
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization)
  })
});

server.listen(4000).then(({
  url,
}) => {
  console.log(`🚀 Server ready at ${url}`);
});