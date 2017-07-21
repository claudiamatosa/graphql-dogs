# 🐶 GraphQL Dogs 💩

This app demonstrates how to set up a simple Apollo server and React client, using dog pics from Twitter and Flickr and Firebase to store the ratings.

Inspired by [WeRateDogs™](https://twitter.com/dog_rates).

## Add the following variables to your environment

```
# Twitter
TWITTER_API_KEY

# Flickr
FLICKR_API_KEY

# Firebase
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_DATABASE_URL
FIREBASE_PROJECT_ID
```

Obtaining the keys:

- [Twitter API >](https://apps.twitter.com/)
- [Flickr API >](https://www.flickr.com/services/api/misc.api_keys.html)
- [Firebase >](https://firebase.google.com/)

## Running the app

This will run the server and frontend instances in parallel.

```
yarn
yarn start
```

For debugging, it may be more helpful to run the server and client in a separate
terminal. For those purposes, you can use `yarn start:server` and `yarn start:client`.

## Tutorials
- [Apollo and React Full Stack](https://dev-blog.apollodata.com/full-stack-react-graphql-tutorial-582ac8d24e3b)
