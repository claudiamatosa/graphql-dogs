import express from 'express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import cors from 'cors';
import { 
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';

import { schema } from './schema';

const PORT = 4000;

const serverHost = process.env.REACT_APP_GRAPHQLDOGS_SERVER || `localhost:${PORT}`;
const isHttps = process.env.NODE_ENV !== 'development';

const server = express();

// Websocket for subscriptions
const ws = createServer(server);

if (process.env.NODE_ENV === 'development') {
  server.use('*', cors({ origin: 'http://localhost:3000' }));
}

// Check schema (introspection): /graphql?query=%7B__schema%7Btypes%7Bname%7D%7D%7D
server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

// Configure GraphiQL (pronounced `Graphical`): http://localhost:4000/graphiql?query={__schema{types{name}}}
server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `${isHttps ? 'wss' : 'ws'}://${serverHost}/subscriptions`,
}));

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on ${isHttps ? 'https' : 'http'}://localhost:${PORT}`);

  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});
