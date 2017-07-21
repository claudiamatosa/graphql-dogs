import axios from 'axios';
import hash from 'string-hash';
import getOr from 'lodash/fp/getOr';
import base58 from './base58';
import encodeUrlParams from './encode-url-params';

const config = {
  apiUrl: 'https://api.flickr.com/services/rest',
  defaultParams: {
    api_key: process.env.FLICKR_API_KEY,
    method: 'flickr.photos.search',
    format: 'json',
    nojsoncallback: 1,
    media: 'photos',
  }
};

const getPhotos = async ({tags, pageSize}) => {
  const userParams = {
    tags,
    per_page: pageSize,
  };

  const requestUrl = `${config.apiUrl}/?${encodeUrlParams(config.defaultParams, userParams)}}`;
  const response = await axios.get(requestUrl);
  return getOr([], 'data.photos.photo')(response);
};

const formatUrl = (photo) => `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
const formatLinkToOriginal = (photo) => `https://flic.kr/p/${base58().encode(parseInt(photo.id, 10))}`;
const formatHash = (photo) => hash(formatUrl(photo));

const Flickr = () => ({
  photos: getPhotos,
  formatters: {
    hash: formatHash,
    url: formatUrl,
    linkToOriginal: formatLinkToOriginal,
  },
});

export default Flickr;
