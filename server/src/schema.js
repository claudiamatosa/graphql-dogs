import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import {resolvers} from './resolvers';

const typeDefs = `
  scalar GraphQLLong

  enum PhotoType {
    flickr
    twitter
  }

  type Photo {
    hash: GraphQLLong! @isUnique
    type: PhotoType
    url: String
    original: String
    rating: Int
  }

  type Query {
    photos: [Photo]
  }

  type Mutation {
    addVote(photoHash: GraphQLLong!, value: Int!): Photo
  }

  type Subscription {
    ratingChanged: Photo
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Enable to get dummy results
// addMockFunctionsToSchema({ schema });

export { schema };
