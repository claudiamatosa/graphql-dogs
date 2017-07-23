import { graphql } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import {
  addVote,
  getAverage,
} from '../data';
import { schema } from '../schema';

jest.mock('../data', () => ({
  addVote: jest.fn(),
  getAverage: jest.fn(),
}));

jest.mock('graphql-subscriptions', () => ({
  PubSub: jest.fn().mockImplementation(function () {}),
  withFilter: jest.fn(),
}));

describe('get photos query', () => {
  afterEach(() => {
    addVote.mockReset();
    getAverage.mockReset();
  });

  describe('happy path', () => {
    const photoHash = 1290481294;
    const voteValue = 10;
    const newAverage = 11;
    const publishMock = jest.fn();
    let result;

    beforeAll(async () => {
      const mutation = `
        mutation ($photoHash: GraphQLLong!, $value: Int!) {
          addVote(photoHash: $photoHash, value: $value) {
            hash
            rating
          }
        }
      `;

      addVote.mockReturnValue({});
      getAverage.mockReturnValue(newAverage);
      PubSub.prototype.publish = publishMock;

      result = await graphql( schema, mutation, null, {}, {photoHash, value: voteValue});
    });

    test('calls addVote with photoHash and value', async () => {
      expect(addVote).toHaveBeenCalledWith(photoHash, voteValue);
    });

    test('emits a ratingChanged event', () => {
      expect(publishMock).toHaveBeenCalledWith('ratingChanged', { ratingChanged: {
        hash: photoHash,
      }, photoHash });
    });

    test('returns the photo hash with the new average', async () => {
      expect(result).toEqual({
        data: {
          addVote: {
            hash: photoHash,
            rating: newAverage,
          }
        }
      });
    });
  });
});
