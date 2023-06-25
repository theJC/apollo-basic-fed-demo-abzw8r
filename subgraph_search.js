import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

function withDelay(results, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(results);
    }, delay);
  });
}

export async function buildSubgraph(port) {
  const typeDefs = gql`
    type Business @key(fields: "id", resolvable: false) {
      id: ID
    }

    type CTA {
      buttonLabel: String
    }

    type BannerAd {
      text: String
    }

    type SearchResult {
      results: [Business]
      bannerAd: BannerAd
    }
    
    type Query {
      search(term: String!): SearchResult
    }
  `;

  const resolvers = {
    Query: {
      search: async (_, { term }, context) => {
        // pretend lookup in the database to get the IDs of matched entities
        const bizIds = await withDelay([1, 2], 100);

        return {
          results: bizIds.map((id) => ({ id })),
          bannerAd: {},
        };
      },
    },
    BannerAd: {
      text: async () => {
        /**
         * Pretend this is some internal call to the nework, or the db, or some
         * other slow thing (that isn't behind GQL)
         */
        const bannerAdText = await withDelay(
          'Click here for a free burger!',
          1000
        );

        return bannerAdText;
      },
    },
  };

  const schema = buildSubgraphSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: ({ req }) => {
      console.log(req.body.query);
    },
  });

  console.log(`Subgraph running ${url}`);
}
