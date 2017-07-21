import { PubSub, withFilter } from 'graphql-subscriptions';
import GraphQLLong from 'graphql-type-long';
import shuffle from 'lodash/fp/shuffle';
import interleave from 'loose-interleave';
import {
  getTwitterPhotos,
  getFlickrPhotos,
  getAverage,
  addVote,
  listenForNewVotes
} from './data';

const pubsub = new PubSub();

export const resolvers = {
  GraphQLLong,

  // Root query resolvers
  Query: {
    photos: async () => {
      const [flickr, twitter] = await Promise.all([getFlickrPhotos(), getTwitterPhotos()]);
      return interleave(flickr, twitter);
    },
  },

  Mutation: {
    addVote: async (root, {photoHash, value}) => {
      const { vote, average } = await addVote(photoHash, value);

      // Publish an event for the subscription
      pubsub.publish('ratingChanged', { ratingChanged: {
        hash: photoHash,
      }, photoHash });

      return {
        hash: photoHash,
      };
    },
  },

  Subscription: {
    ratingChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('ratingChanged'),
        // When subscribing to individual resources, allows comparing payload and variables, so
        // we only return the content that we need
        (payload, variables) => true,
      ),
    }
  },

  // Type resolvers
  Photo: {
    // When a query asks for the rating of a photo, retrieve it from Firebase
    rating: async ({hash, rating}) => {
      const average = await getAverage(hash);
      return average ? Math.round(average).toFixed(0) : null;
    },
  }
};
