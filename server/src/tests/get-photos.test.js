import { graphql } from 'graphql';
import {
  getTwitterPhotos,
  getFlickrPhotos,
  getAverage,
} from '../data';
import { schema } from '../schema';

jest.mock('../data', () => ({
  getTwitterPhotos: jest.fn(),
  getFlickrPhotos: jest.fn(),
  getAverage: jest.fn(),
}));

describe('get photos query', () => {
  afterEach(() => {
    getTwitterPhotos.mockReset();
    getFlickrPhotos.mockReset();
    getAverage.mockReset();
  });

  test('returns the a list of interleaved twitter and flickr photos', async () => {
    const query = `
      query getPhotos {
        photos {
          hash
          type
          url
          original
          rating
        }
      }
    `;

    const twitterPhotos = [{
      hash: 123141,
      type: 'twitter',
      url: 'http://13213rwfes.fsdv',
      original: 'http://twitter.com/13213rwfes.fsdv',
    }, {
      hash: 124124124,
      type: 'twitter',
      url: 'http://13213rwfes.fsdv',
      original: 'http://twitter.com/13213rwfes.fsdv',
    }];

    const flickrPhotos = [{
      hash: 23424234,
      type: 'flickr',
      url: 'http://23424234.fsdv',
      original: 'http://flickr.com/23424234.fsdv',
    }, {
      hash: 124124124,
      type: 'flickr',
      url: 'http://124124124.fsdv',
      original: 'http://flickr.com/124124124.fsdv',
    }];

    getTwitterPhotos.mockReturnValueOnce(twitterPhotos);
    getFlickrPhotos.mockReturnValueOnce(flickrPhotos);
    getAverage
      .mockReturnValueOnce(12)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(11);

    const result = await graphql( schema, query);

    expect(result).toEqual({data: {
      photos: [
        {
          ...flickrPhotos[0],
          rating: 12,
        },
        {
          ...twitterPhotos[0],
          rating: 10,
        },
        {
          ...flickrPhotos[1],
          rating: 9,
        },
        {
          ...twitterPhotos[1],
          rating: 11,
        },
      ]
    }});
  });

  test('returns only twitter photos when flickr returns an empty list', async () => {
    const query = `
      query getPhotos {
        photos {
          hash
          type
          url
          original
        }
      }
    `;

    const twitterPhotos = [{
      hash: 123141,
      type: 'twitter',
      url: 'http://13213rwfes.fsdv',
      original: 'http://twitter.com/13213rwfes.fsdv',
    }, {
      hash: 124124124,
      type: 'twitter',
      url: 'http://13213rwfes.fsdv',
      original: 'http://twitter.com/13213rwfes.fsdv',
    }];

    const flickrPhotos = [];

    getTwitterPhotos.mockReturnValueOnce(twitterPhotos);
    getFlickrPhotos.mockReturnValueOnce(flickrPhotos);

    const result = await graphql( schema, query);

    expect(result).toEqual({data: {
      photos: twitterPhotos
    }});
  });

  test('returns only flickr photos when twitter returns an empty list', async () => {
    const query = `
      query getPhotos {
        photos {
          hash
          type
          url
          original
        }
      }
    `;

    const twitterPhotos = [];

    const flickrPhotos = [{
      hash: 123141,
      type: 'twitter',
      url: 'http://13213rwfes.fsdv',
      original: 'http://twitter.com/13213rwfes.fsdv',
    }, {
      hash: 124124124,
      type: 'twitter',
      url: 'http://13213rwfes.fsdv',
      original: 'http://twitter.com/13213rwfes.fsdv',
    }];

    getTwitterPhotos.mockReturnValueOnce(twitterPhotos);
    getFlickrPhotos.mockReturnValueOnce(flickrPhotos);

    const result = await graphql( schema, query);

    expect(result).toEqual({data: {
      photos: flickrPhotos
    }});
  });
});
