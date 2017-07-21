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

const serverHost = process.env.REACT_APP_GRAPHQLDOGS_SERVER || 'localhost:4000';

const networkInterface = createNetworkInterface({ 
  uri: `http://${serverHost}/graphql`,
});

const wsClient = new SubscriptionClient(`ws://${serverHost}/subscriptions`, {
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
