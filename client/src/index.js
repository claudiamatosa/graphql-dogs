import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';
import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from 'subscriptions-transport-ws';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const host = process.env.REACT_APP_GRAPHQLDOGS_SERVER || 'localhost:4000';
const isHttps = process.env.NODE_ENV !== 'development';

const networkInterface = createNetworkInterface({ 
  uri: `${isHttps ? 'https' : 'http'}://${host}/graphql`,
});

const wsClient = new SubscriptionClient(`${isHttps ? 'wss' : 'ws'}://${host}/subscriptions`, {
  reconnect: true,
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
registerServiceWorker();
