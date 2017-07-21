import firebase from 'firebase';

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const endpoints = {
  votes: (photoHash) => `ratings/${photoHash}/votes`,
  average: (photoHash) => `ratings/${photoHash}/average`,
};

const Firebase = () => {
  firebase.initializeApp(config);
  const database = firebase.database();

  return {
    database,
    average: (photoHash) => database.ref(endpoints.average(photoHash)),
    votes: (photoHash) => database.ref(endpoints.votes(photoHash)),
  };
};

export default Firebase;
