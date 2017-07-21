import axios from 'axios';
import hash from 'string-hash';
import getOr from 'lodash/fp/getOr';
import encodeUrlParams from './encode-url-params';

const config = {
  apiKey: process.env.TWITTER_API_KEY,
  apiUrl: `https://api.twitter.com`,
};

const endpoints = {
  token: `${config.apiUrl}/oauth2/token`,
  tweets: `${config.apiUrl}/1.1/search/tweets.json`,
};

const getToken = async () => {
  try {
    const authToken = Buffer.from(config.apiKey).toString('base64');

    const response = await axios.post(`${endpoints.token}?grant_type=client_credentials`, {}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': `Basic ${authToken}`,
        method: 'POST',
      },
    });
    
    return response.data.access_token;
  } catch (e) {
    throw new Error(`Error fetching twitter access token: ${e}`);
  }
};

const getTweets = (accessToken) => async ({query, pageSize}) => {
  const userParams = {
    q: query,
    count: pageSize,
  };

  const response = await axios.get(`${endpoints.tweets}?${encodeUrlParams(userParams)}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

  return getOr([], 'data.statuses')(response);
};

const paths = {
  imageUrl: 'entities.media[0].media_url',
  userName: 'user.screen_name',
  tweetId: 'id_str',
};

const formatUrl = getOr(null, paths.imageUrl);
const formatLinkToOriginal = tweet => {
  const userName = getOr('', paths.userName)(tweet);
  const tweetId = getOr('', paths.tweetId)(tweet);
  return `https://twitter.com/${userName}/status/${tweetId}`;
};
const formatHash = tweet => hash(formatUrl(tweet));

const Twitter = () => {
  let accessToken;

  return {
    tweets: async ({query, pageSize}) => {
      if (!accessToken) {
        accessToken = await getToken();
      }

      return getTweets(accessToken)({query, pageSize});
    },
    formatters: {
      hash: formatHash,
      url: formatUrl,
      linkToOriginal: formatLinkToOriginal,
    },
  };
};

export default Twitter;
