import axios from 'axios';
import hash from 'string-hash';
import getOr from 'lodash/fp/getOr';
import values from 'lodash/fp/values';
import Flickr from './utilities/flickr';
import Twitter from './utilities/twitter';
import Firebase from './utilities/firebase';

const flickr = Flickr();
const twitter = Twitter();
const firebase = Firebase();

export const getFlickrPhotos = async () => {
  try {
    const photos = await flickr.photos({
      tags: 'puppy,daschund,jackrussel,chihuahua',
      pageSize: 30,
    });

    return photos.map(photo => ({
      type: 'flickr',
      hash: flickr.formatters.hash(photo),
      url: flickr.formatters.url(photo),
      original: flickr.formatters.linkToOriginal(photo),
    }));
  } catch (e) {
    throw new Error(`Failure fetching photos from Flickr: ${e}`);
  }
};

export const getTwitterPhotos = async () => {
  try {
    const tweets = await twitter.tweets({
      query: '#puppy filter:images -filter:retweets -from:PUPPERland -from:IBZsYard',
      // the pageSize is larger for twitter so we can account for non-existing images
      pageSize: 40,
    });

    return tweets
      // Remove tweets with no images
      .filter(twitter.formatters.url)
      .map(tweet => ({
        type: 'twitter',
        hash: twitter.formatters.hash(tweet),
        url: twitter.formatters.url(tweet),
        original: twitter.formatters.linkToOriginal(tweet),
      }));
  } catch (e) {
    throw new Error(`Failure fetching photos from Twitter: ${e}`);
  }
};

export const getAverage = async (photoHash) => {
  try {
    const snapshot = await firebase.average(photoHash).once('value');
    return snapshot.val();
  } catch (e) {
    throw new Error(`Failure fetching average rating from firebase for photo ${photoHash}: ${e}`);
  }
};

export const addVote = async (photoHash, value) => {
  try {
    const votes = firebase.votes(photoHash);
    const average = firebase.average(photoHash);

    const addVote = await votes.push(value);

    // Get the list of all votes and update the average
    const allVotesSnapshot = await votes.once('value');
    const allVotes = values(allVotesSnapshot.val());
    const sum = allVotes.reduce((sum, value) => (sum + value), 0);
    const newAverage = await average.set(sum / allVotes.length);
    
    return {
      value,
      average: newAverage,
    };
  } catch (e) {
    throw new Error(`Failure adding new vote (${value}) for photo ${photoHash}: ${e}`);
  }
};
