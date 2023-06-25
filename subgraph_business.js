import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

const businesses = {
  1: { id: 1, name: 'McDonalds', rating: 3.14 },
  2: { id: 2, name: 'Wendys', rating: 1.14 },
  3: { id: 3, name: 'Burger King', rating: 2.72 },
};

function withDelay(results, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(results);
    }, delay);
  });
}

export async function buildSubgraph(port) {
  const typeDefs = gql`
    type Business @key(fields: "id") {
      id: ID
      name: String
      rating: Float
    }
  `;

  const resolvers = {
    Business: {
      __resolveReference({ id }) {
        // simulate that looking up the details of a business is slow
        return withDelay(businesses[id], 1000);
      },
    },
  };

  const schema = buildSubgraphSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`Business Subgraph running ${url}`);
}
